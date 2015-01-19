angular.module('tweetCalendarApp.controllers').controller('EventCtrl', function($http, $scope, EventService){
    $scope.eventInfo = { };
    $scope.users = { };
    $scope.groups = { };
    $scope.userGroups = { };

    $scope.newEventType;
    $scope.newUser;
    $scope.selectedGroup;

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


    socket.on('group-added', function(data) {
        var response = 'Dodales grupy do wydarzenia : ' + data.response;
        console.log(response);
        $scope.getGroups($scope.eventInfo.event_id);
    });

    socket.on('event-deleted', function(data) {
        var response = 'Usunales event: ' + data.response;
        console.log(response);
        window.location.href = '/calendar';
    });

    socket.on('event-accepted', function(data) {
        var response = 'Zaakceptowales event: ' + data.response;
        console.log(response);
        window.location.reload;
    });

    $scope.acceptEvent = function(eventID)
    {
        var data = { 'eventID' : $scope.eventInfo.event_id, 'response' : true };
        console.log(data);
        socket.emit('accept-event', data);
    }

    $scope.rejectEvent = function(eventID)
    {
        var data = { 'eventID' : $scope.eventInfo.event_id, 'response' : false };
        console.log(data);
        socket.emit('accept-event', data);
    }

    $scope.checkOwner = function(userID)
    {
        console.log(userID);

        if ($scope.eventInfo.owner_id==userID) return 'owner';
        else return 'accepted';

        //return $scope.eventInfo.owner_id==userID;
    }

    $scope.addUser = function(userEmail)
    {
        var data = { 'eventID' : $scope.eventInfo.event_id, 'users' : [ userEmail ]};
        socket.emit('add-emails', data);
    }

    $scope.addGroup = function(groupID)
    {
        console.log(groupID);
        var data = { 'eventID' : $scope.eventInfo.event_id, 'groupID' : groupID };
        console.log(data);
        socket.emit('add-group', data);
    }

    $scope.deleteUser = function(userID)
    {
        var data = { 'eventID' : $scope.eventInfo.event_id, 'users' : [ userID ]}
        socket.emit('delete-users', data)
    }

    $scope.deleteEventButton = function()
    {
        $('#ModalerinoDelete').modal('show');
    }

    $scope.hide = function()
    {
        $('#ModalerinoDelete').modal('hide');
    }

    $scope.deleteEvent = function(eventID)
    {
        var data = { 'eventID' : $scope.eventInfo.event_id };
        socket.emit('delete-event', data);
        console.log(eventID);
    }

    $scope.editEvent = function(eventID)
    {
        console.log(eventID);
        $scope.newEventType = $scope.eventInfo.type_code;
        $('#Modalerino').modal('show');
    }


    $scope.init = function(eventID)
    {
        $scope.getEventInfo(eventID);
        $scope.getUsers(eventID);
        $scope.getGroups(eventID)
        $scope.getUserGroups();
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

    }

    $scope.getGroups = function(eventID)
    {
        EventService.getGroups(eventID).then(function(data) {
            $scope.groups = data;
        })
    }

    $scope.getUserGroups = function()
    {
        EventService.getUserGroups().then(function(data) {
            $scope.userGroups = data;
            console.log($scope.userGroups);
        })
    }
});