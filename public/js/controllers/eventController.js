angular.module('tweetCalendarApp.controllers').controller('EventCtrl', function($http, $scope, EventService){
    $scope.eventInfo = { };

    $scope.init = function(eventID)
    {
        console.log(eventID);

        EventService.getEventInfo(eventID).then(function(data) {
            $scope.eventInfo = data[0];
        });
    }
});