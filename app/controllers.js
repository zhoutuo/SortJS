'use strict';
controllers.controller('baseCtrl', ['$scope', 'notifier', 'sorters', function($scope, notifier, sorters) {
    //variables init
    $scope.algos = sorters.getSorters();
    $scope.random_len = "";
    $scope.input_array = "";
    $scope.selected_sorter = undefined;
    $scope.ascending = true;
    $scope.panel_visibility = false;
    var maxInputArrayLen = 100;
    $scope.randomGenerate = function() {
        if($scope.random_len === "" || isNaN(Number($scope.random_len))) {
            // default value of 10
            $scope.random_len = "10";
        }
        var len = parseInt($scope.random_len, 10);
        var randomInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        var output = [];
        for(var i = 0; i < len; ++i) {
            output.push(randomInt(-100000, 100000));
        }
        // populate
        $scope.input_array = output.join(", ");
    };


    $scope.run = function() {
        if($scope.input_array === "") {
            notifier.error("please input numbers to run");
            return;
        }
        if($scope.selected_sorter === undefined) {
            notifier.error("please select a sorter to run");
            return;
        }
        //parse the input array
        var nums = $scope.input_array.split(',', maxInputArrayLen);
        for(var i = 0; i < nums.length; ++i) {
            //convert all strings to numbers
            nums[i] = Number(nums[i]);
            //if Nan exists
            if(isNaN(nums[i])) {
                notifier.error("detected a Nan", "Parsing error")
                return;
            }
        }
        // toggle visibility
        toggleVisibility();
        //fire the event
        $scope.$broadcast('run', {
            sorter: $scope.selected_sorter,
            numbers: nums,
            ascending: $scope.ascending
        });
    };

    $scope.rerun = function() {
        toggleVisibility();
    };

    $scope.togglePlayAction = 'pause';
    $scope.togglePlay = function() {
        if($scope.togglePlayAction === 'pause') {
            $scope.$broadcast('pause');
            $scope.togglePlayAction = 'play';
        } else {
            $scope.$broadcast('play');
            $scope.togglePlayAction = 'pause';
        }
    };

    function toggleVisibility() {
        $scope.panel_visibility = !$scope.panel_visibility;
    }
}]);