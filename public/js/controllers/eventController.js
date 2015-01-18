angular.module('tweetCalendarApp.controllers').controller('EventCtrl', function($http, $scope, EventService){
    $scope.eventInfo = { };
    $scope.users = { };
    $scope.groups = { };

    $scope.newUser;
    $scope.newGroup;

    socket.on('users-added', function(data) {
        var response = 'Dodales uzytkownikow do wydarzenia : ' + data.response;
        console.log(response);
    });


    socket.on('groups-added', function(data) {
        var response = 'Dodales grupy do wydarzenia : ' + data.response;
        console.log(response);
    });

    $scope.addUser = function(userEmail)
    {
        var data = { 'eventID' : $scope.eventInfo.event_id, 'users' : [ userEmail ]};
        console.log(data);
        socket.emit('add-users', data);
    }

    $scope.addGroup = function(groupName)
    {
        var data = { 'eventID' : $scope.eventInfo.event_id, 'groups' : [ groupName ]};
        console.log(data);
        socket.emit('add-groups', data);
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

        EventService.getGroups(eventID).then(function(data) {
            $scope.groups = data;
        })
    }
});