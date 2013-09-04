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
                // tweenGroup is used to present the tweens
                tweensGroup,
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
                if(tweensGroup) {
                    tweensGroup.destroy();
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
                var movingCount = 0;
                var runStep = function (i) {
                    if (i >= steps.length || i < 0) {
                        return;
                    }
                    var tweens = [];
                    var curStep = steps[i];
                    for(var j = curStep[0]; j <= curStep[1]; ++j) {
                        var current = j;
                        var next;
                        if (j === curStep[1]) {
                            next = curStep[0];
                        } else {
                            next = j + 1;
                        }
                        var elemA = elements[current];
                        var elemB = elements[next];
                        tweens.push(new Kinetic.Tween({
                            node: elemA,
                            duration: 1,
                            x: elemB.getX(),
                            y: elemB.getY()
                        }));
                        //push to the top in case of being covered
                        elemA.moveToTop();
                    }

                    tweensGroup = new TweensGroup(tweens, function() {
                        //swap ref
                        var tmp = elements[curStep[1]];
                        for(var j = curStep[1]; j > curStep[0]; --j) {
                            elements[j] = elements[j - 1];
                        }
                        //last one
                        elements[curStep[0]] = tmp;

                        // next step
                        runStep(i + 1);
                    });

                    // update counting
                    movingCount += (curStep[1] - curStep[0] + 1);
                    countingTxt.setText('Comparisons: ' + result.comparisonCount +
                        '\nMovings: ' + movingCount);
                    layer.draw();
                    // play the tweens
                    tweensGroup.play();

                };
                //run the steps
                runStep(0);
            }

            function pauseSorting() {
                if (tweensGroup) {
                    tweensGroup.pause();
                }
            }

            function playSorting() {
                if (tweensGroup) {
                    tweensGroup.play();
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

            /**
             * This is a wrapper to present multiple tweens
             * providing unified API to all of the tweens
             * @param tweens
             * @constructor
             */
            function TweensGroup(tweens, onFinish) {
                this.tweens = tweens;
                var finishCount = 0;
                var finish = function() {
                    ++finishCount;
                    if(finishCount === tweens.length) {
                        // fire
                        onFinish();
                    }
                };

                //add finish event
                for(var i = 0; i < this.tweens.length; ++i) {
                    this.tweens[i].onFinish = finish;
                }

                this.play = function() {
                    for(var i = 0; i < this.tweens.length; ++i) {
                        this.tweens[i].play();
                    }
                }

                this.pause = function() {
                    for(var i = 0; i < this.tweens.length; ++i) {
                        this.tweens[i].pause();
                    }
                }

                this.destroy = function() {
                    for(var i = 0; i < this.tweens.length; ++i) {
                        this.tweens[i].destroy();
                    }
                }
            }
        }
    };
}]);