'use strict';
directives.directive("visualPanel", ['sorters', function(sorters) {
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element) {
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
                for(var i = 0; i < numbers.length; ++i) {
                    var curRow = Math.floor(i / colCount);
                    var curCol = i % colCount;
                    var curX = startingPos.x + curCol * rectWidth;
                    var curY = startingPos.y + curRow * rectHeight;
                    var rect = new Kinetic.Rect({
                        x: curX,
                        y: curY,
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
                        x: curX,
                        y: curY + rectHeight / 2,
                        width: rectWidth
                    });
                    text.setOffset({
                        y: text.getHeight() / 2
                    });
                    // group them
                    var group = new Kinetic.Group({
                        name: elementName
                    });
                    group.add(rect);
                    group.add(text);

                    layer.add(group);

                }
                // draw layer
                stage.add(layer);
            }

            createCanvas();

            scope.$on('run', function(event, args) {
                var sorter = args.sorter;
                var numbers = args.numbers;
                populateCanvas(numbers);
            });

        }
    };
}]);