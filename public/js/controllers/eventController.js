angular.module('tweetCalendarApp.controllers').controller('EventCtrl', function($http, $scope, EventService){
    $scope.eventInfo = { };
    $scope.users = { };
    $scope.groups = { };

    $scope.newUser;
    $scope.newGroup;

    socket.on('emails-added', function(data) {
        var response = 'Dodales uzytkownikow do wydarzenia : ' + data.response;
        console.log(response);
        $scope.getUsers($scope.eventInfo.event_id);
    });

    socket.on('users-deleted', function(data) {
        var response = 'Usunales uzytkownikow z wydarzenia : ' + data.response;
        console.log(response);
        $scope.getUsers($scope.eventInfo.event_id);
    });


    socket.on('groups-added', function(data) {
        var response = 'Dodales grupy do wydarzenia : ' + data.response;
        console.log(response);
    });

    $scope.addUser = function(userEmail)
    {
        var data = { 'eventID' : $scope.eventInfo.event_id, 'users' : [ userEmail ]};
        socket.emit('add-emails', data);
    }

    $scope.addGroup = function(groupName)
    {
        var data = { 'eventID' : $scope.eventInfo.event_id, 'groups' : [ groupName ]};
        console.log(data);
        socket.emit('add-groups', data);
    }

    $scope.deleteUser = function(userID)
    {
        var data = { 'eventID' : $scope.eventInfo.event_id, 'users' : [ userID ]}
        socket.emit('delete-users', data)
    }

    $scope.init = function(eventID)
    {
        $scope.getEventInfo(eventID);

        $scope.getUsers(eventID);
    }

    $scope.getEventInfo = function(eventID)
    {
        EventService.getEventInfo(eventID).then(function(data) {
            $scope.eventInfo = data[0];
        });
    }

    $scope.getUsers = function(eventID)
    {
        EventService.getUsers(eventID).then(function(data) {
            $scope.users = data;
        });

        EventService.getGroups(eventID).then(function(data) {
            $scope.groups = data;
        })
    }

});