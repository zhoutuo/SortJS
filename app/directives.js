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
                        fill: 'lightblue',
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
                    // group them
                    var group = new Kinetic.Group({
                        x: curX,
                        y: curY,
                        name: elementName
                    });
                    group.add(rect);
                    group.add(text);

                    layer.add(group);

                }
                // draw layer
                stage.add(layer);
            }

            /**
             *
             * @param {Array} numbers
             * @param {Function} sorter a sorting method
             */
            function runSorting(numbers, sorter) {
                var steps = sorter(numbers);
                var elements = stage.get('.' + elementName);
                var runStep = function(i) {
                    if(i >= numbers.length || i < 0) {
                        return;
                    }
                    var left = steps[i][0];
                    var right = steps[i][1];
                    var elemA = elements[left];
                    var elemB = elements[right];
                    //tween
                    var tweenA = new Kinetic.Tween({
                        node: elemA,
                        duration: 1,
                        x: elemB.getX(),
                        y: elemB.getY()
                    });
                    var tweenB = new Kinetic.Tween({
                        node: elemB,
                        duration: 1,
                        x: elemA.getX(),
                        y: elemA.getY(),
                        onFinish: function() {
                            runStep(i + 1);
                        }
                    });
                    //move up first in case of covered by other blocks
                    elemA.moveToTop();
                    elemB.moveToTop();
                    layer.draw();
                    tweenA.play();
                    tweenB.play();

                    //only swap group ref
                    elements[left] = elemB;
                    elements[right] = elemA;
                };
                //run the steps
                runStep(0);
            }

            createCanvas();

            scope.$on('run', function (event, args) {
                var sorter = args.sorter;
                var numbers = args.numbers;
                cleanCanvas();
                populateCanvas(numbers);
                runSorting(numbers, sorters[sorter]);
            });

        }
    };
}]);