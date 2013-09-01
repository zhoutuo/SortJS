'use strict';services.factory('notifier', [function() {
    var factory = {};
    factory.success = function(message, title) {
        if(title) {
            Notifier.success(message, title);
        } else {
            Notifier.success(message);
        }
    };

    factory.info = function(message, title) {
        if(title) {
            Notifier.info(message, title);
        } else {
            Notifier.info(message);
        }
    };

    factory.warning = function(message, title) {
        if(title) {
            Notifier.warning(message, title);
        } else {
            Notifier.warning(message);
        }
    };

    factory.error = function(message, title) {
        if(title) {
            Notifier.error(message, title);
        } else {
            Notifier.error(message);
        }
    };

    return factory;
}]);