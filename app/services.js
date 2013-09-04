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
                if (numbers[j] > numbers[j + 1] === ascending) {
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
                if(numbers[j] > numbers[i] === ascending) {
                    // store the value of i
                    var tmp = numbers[i];
                    // shift numbers from j to i - 1
                    for(var z = i; z > j; --z) {
                        numbers[z] = numbers[z - 1];
                    }
                    numbers[j] = tmp;

                    // add to step
                    var curStep = [j, i];
                    steps.push(curStep);
                    break;
                }
            }
        }
        return new factory.SortResult(cmpCount, steps);
    };
    factory.Merge = function () {

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