/**
 * Created by Muzyk on 2015-01-18.
 */
angular.module('tweetCalendarApp.services').factory('NotificationService', function($http) {
    var factory = {};

    factory.getUserNotifications = function() {
        return $http.get("/resources/userNotifications/").then(function(result) {
            return result.data;
        });
    };

    return factory;
});