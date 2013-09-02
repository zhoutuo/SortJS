'use strict';
services.factory('sorters', [function () {
    var factory = {};
    var sorters = ['Bubble', 'Insertion', 'Merge', 'Quick'];
    factory.getSorters = function () {
        return sorters;
    };
    /**
     * Implementation of bubble sorting
     * @param {Array} numbers
     * @param {Boolean} ascending sorting order
     * @returns {Array} steps to sort numbers
     */
    factory.Bubble = function (numbers, ascending) {
        ascending = ascending || true;
        var steps = [];
        // find ith biggest/smallest number
        for (var i = 0; i < numbers.length; ++i) {
            var flag = false;
            // bubble up, stop at sorted section
            for (var j = 0; j < numbers.length - i - 1; ++j) {
                var res = numbers[j] > numbers[j + 1];
                res *= ascending;
                if (res) {
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
        return steps;
    };
    factory.Insertion = function () {

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