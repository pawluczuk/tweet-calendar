/**
 * Created by Muzyk on 2015-01-18.
 */
angular.module('tweetCalendarApp.controllers').controller('NotificationCtrl', function($http, $scope, NotificationService){
    $scope.notifications = {};

    $scope.getUserNotifications = function()
    {
        NotificationService.getUserNotifications().then(function(data) {
            $scope.notifications = data;
        });

    }

});