angular.module('tweetCalendarApp.controllers').controller('EventCtrl', function($http, $scope, EventService){
    $scope.eventInfo = { };
    $scope.users = { };

    $scope.newUser;

    $scope.addUser = function(userID)
    {
        var data = { 'eventID' : $scope.eventInfo.event_id, 'users' : [ userID ]};
        console.log(data);
        //socket.emit('add-users', data);
    }

    $scope.deleteUser = function(userID)
    {
        console.log(userID);
    }

    $scope.init = function(eventID)
    {
        EventService.getEventInfo(eventID).then(function(data) {
            $scope.eventInfo = data[0];
        });

        EventService.getUsers(eventID).then(function(data) {
            $scope.users = data;
        });
    }
});