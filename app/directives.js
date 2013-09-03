'use strict';
directives.directive("visualPanel", ['sorters', function (sorters) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element) {
            var stage,
                layer,
                rectWidth,
                rectHeight = 80,
                rowCount,
                colCount = 10,
                // tween A & B are used to swap two elements
                tweenA,
                tweenB,
                // status bar is used to show the current swap info
                statusBar,
                // counting is used to count steps
                countingTxt,
                elementName = 'input_element';

            function createCanvas() {
                stage = new Kinetic.Stage({
                    container: element[0], // raw dom element
                    width: element.width(),
                    height: 1000
                });
                layer = new Kinetic.Layer();
            }

            function cleanCanvas() {
                if (tweenA) {
                    tweenA.destroy();
                }
                if (tweenB) {
                    tweenB.destroy();
                }
                layer.removeChildren();
            }

            function populateCanvas(numbers) {
                rowCount = Math.ceil(numbers.length / colCount);
                var non_margin = 0.8;
                // generate rect spec
                rectWidth = stage.getWidth() * non_margin / colCount;
                // calculate drawing pos
                var startingPos = {
                    x: stage.getWidth() * (1 - non_margin) / 2,
                    y: stage.getHeight() * (1 - non_margin) / 2
                };
                // draw all rects
                for (var i = 0; i < numbers.length; ++i) {
                    var curRow = Math.floor(i / colCount);
                    var curCol = i % colCount;
                    var curX = startingPos.x + curCol * rectWidth;
                    var curY = startingPos.y + curRow * rectHeight;
                    var rect = new Kinetic.Rect({
                        width: rectWidth,
                        height: rectHeight,
                        fill: 'LightBlue',
                        stroke: 'black',
                        strokeWidth: 1
                    });
                    // add number in the center of rect
                    var text = new Kinetic.Text({
                        text: numbers[i],
                        fill: 'black',
                        align: 'center',
                        y: rectHeight / 2,
                        width: rectWidth,
                        name: 'value'
                    });
                    text.setOffset({
                        y: text.getHeight() / 2
                    });
                    // add original index
                    var index = new Kinetic.Text({
                        text: i,
                        fill: 'green',
                        align: 'center',
                        width: rectWidth
                    });
                    // group them
                    var group = new Kinetic.Group({
                        x: curX,
                        y: curY,
                        name: elementName
                    });
                    group.add(rect);
                    group.add(text);
                    group.add(index);
                    layer.add(group);
                }
                // add status bar
                statusBar = new Kinetic.Text({
                    width: element.width(),
                    align: 'center',
                    padding: 20,
                    fontSize: 18,
                    fill: 'coral'
                });
                layer.add(statusBar);
                // add counting
                countingTxt = new Kinetic.Text({
                    width: element.width(),
                    align: 'right',
                    padding: 20,
                    fontSize: 18,
                    fill: 'LimeGreen'
                });
                layer.add(countingTxt);
                // draw layer
                stage.add(layer);
            }

            /**
             *
             * @param {sorters.SortResult} result
             */
            function runSorting(result) {
                var steps = result.steps;
                var elements = stage.get('.' + elementName);
                var runStep = function (i) {
                    if (i >= steps.length || i < 0) {
                        return;
                    }
                    var left = steps[i][0];
                    var right = steps[i][1];
                    var elemA = elements[left];
                    var elemB = elements[right];
                    //tween
                    tweenA = new Kinetic.Tween({
                        node: elemA,
                        duration: 1,
                        x: elemB.getX(),
                        y: elemB.getY()
                    });
                    tweenB = new Kinetic.Tween({
                        node: elemB,
                        duration: 1,
                        x: elemA.getX(),
                        y: elemA.getY(),
                        onFinish: function () {
                            runStep(i + 1);
                        }
                    });
                    //move up first in case of covered by other blocks
                    elemA.moveToTop();
                    elemB.moveToTop();
                    //update status bar
                    statusBar.setText('Element ' + left +
                        ' is swapping with element ' + right + '.');
                    // update counting
                    countingTxt.setText('Comparisons: ' + result.comparisonCount +
                        '\nSwaps: ' + (i + 1) + "/" + steps.length);
                    layer.draw();
                    playSorting();

                    //only swap group ref
                    elements[left] = elemB;
                    elements[right] = elemA;
                };
                //run the steps
                runStep(0);
            }

            function pauseSorting() {
                if (tweenA) {
                    tweenA.pause();
                }
                if (tweenB) {
                    tweenB.pause();
                }
            }

            function playSorting() {
                if (tweenA) {
                    tweenA.play();
                }
                if (tweenB) {
                    tweenB.play();
                }
            }

            createCanvas();

            scope.$on('run', function (event, args) {
                var sorter = args.sorter;
                var numbers = args.numbers;
                var ascending = args.ascending;
                cleanCanvas();
                populateCanvas(numbers);
                var result = sorters[sorter](numbers, ascending);
                runSorting(result);
            });

            scope.$on('pause', function () {
                pauseSorting();
            });

            scope.$on('play', function () {
                playSorting();
            });
        }
    };
}]);