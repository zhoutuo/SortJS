'use strict';
services.factory('sorters', [function () {
    var factory = {};
    var sorters = ['Bubble', 'Insertion', 'Merge', 'Quick'];
    /**
     * The class to contain the sorting result
     * @param cmpCount
     * @param steps
     * @constructor
     */
    factory.SortResult = function(cmpCount, steps) {
        this.comparisonCount = cmpCount;
        this.steps = steps;
    };
    factory.getSorters = function () {
        return sorters;
    };
    /**
     * Implementation of bubble sorting
     * @param {Array} numbers
     * @param {Boolean} ascending sorting order
     * @returns {sorters.SortResult} steps to sort numbers
     */
    factory.Bubble = function (numbers, ascending) {
        var steps = [];
        var cmpCount = 0;
        // find ith biggest/smallest number
        for (var i = 0; i < numbers.length; ++i) {
            var flag = false;
            // bubble up, stop at sorted section
            for (var j = 0; j < numbers.length - i - 1; ++j) {
                ++cmpCount;
                // exclude equality case
                if (numbers[j] > numbers[j + 1] === ascending &&
                    numbers[j] < numbers[j + 1] !== ascending) {
                    //swap two element
                    //a, b => a+b, b=>a+b, a=>b, a
                    numbers[j] += numbers[j + 1];
                    numbers[j + 1] = numbers[j] - numbers[j + 1];
                    numbers[j] = numbers[j] - numbers[j + 1];
                    //add step
                    steps.push([j, j + 1]);
                    //signify the flag
                    flag = true;
                }
            }
            if (!flag) {
                break;
            }
        }
        return new factory.SortResult(cmpCount, steps);
    };
    factory.Insertion = function (numbers, ascending) {
        var steps = [];
        var cmpCount = 0;
        for(var i = 1; i < numbers.length; ++i) {
            for(var j = 0; j < i; ++j) {
                ++cmpCount;
                // if j is the place the insert
                if(numbers[j] > numbers[i] === ascending &&
                    numbers[j] < numbers[i] !== ascending) {
                    // store the value of i
                    var tmp = numbers[i];
                    // shift numbers from j to i - 1
                    for(var z = i; z > j; --z) {
                        numbers[z] = numbers[z - 1];
                    }
                    numbers[j] = tmp;

                    // add to step
                    var curStep = [];
                    for(var z = j; z <= i; ++z) {
                        curStep.push(z);
                    }
                    steps.push(curStep);
                    break;
                }
            }
        }
        return new factory.SortResult(cmpCount, steps);
    };
    factory.Merge = function (numbers, ascending) {
        var cmpCount = 0;
        var steps = [];
        var merge = function(numbers, ascending, offset) {
            // special case, already sorted
            if(numbers.length === 1 || numbers.length === 0) {
                return numbers;
            }
            var middle = Math.floor(numbers.length / 2);
            //divide
            var left = merge(numbers.slice(0, middle), ascending, offset);
            var right = merge(numbers.slice(middle, numbers.length), ascending, offset + middle);
            // combine
            var res = [];
            var leftidx = 0;
            var rightidx = 0;
            while(leftidx < left.length && rightidx < right.length) {
                ++cmpCount;
                var left_top = left[leftidx];
                var right_top = right[rightidx];
                if(left_top < right_top === ascending ||
                    left_top > right_top === !ascending) {
                    res.push(left_top);
                    // add step
//                    steps.push([leftidx + offset, res.length - 1 + offset]);
                    //move forward
                    ++leftidx;
                } else {
                    res.push(right_top);
                    // add step
//                    steps.push([left.length + rightidx - 1 + offset, res.length - 1 + offset]);
                    //move forward
                    ++rightidx;
                }
            }
            // appending the rest if exists
            if(leftidx != left.length) {
                for(var i = leftidx; i < left.length; ++i) {
                    res.push(left[i]);
                    steps.push([i + offset, res.length - 1 + offset]);
                }
            }
            // appending the rest if exists
            if(rightidx != right.length) {
                for(var i = rightidx; i < right.length; ++i) {
                    res.push(right[i]);
                    steps.push([i + offset + left.length - 1, res.length - 1 + offset]);
                }

            }
            return res;
        };
        // run the algorithm
        console.log(merge(numbers, ascending, 0));
        console.log(steps);
        return new factory.SortResult(cmpCount, steps);
    };
    factory.Quick = function () {

    };
    return factory;
}]);
services.factory('notifier', [function () {
    var factory = {};
    factory.success = function (message, title) {
        if (title) {
            Notifier.success(message, title);
        } else {
            Notifier.success(message);
        }
    };

    factory.info = function (message, title) {
        if (title) {
            Notifier.info(message, title);
        } else {
            Notifier.info(message);
        }
    };

    factory.warning = function (message, title) {
        if (title) {
            Notifier.warning(message, title);
        } else {
            Notifier.warning(message);
        }
    };

    factory.error = function (message, title) {
        if (title) {
            Notifier.error(message, title);
        } else {
            Notifier.error(message);
        }
    };

    return factory;
}]);