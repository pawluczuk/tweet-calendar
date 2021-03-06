angular.module('tweetCalendarApp.controllers').controller('GroupCtrl', function($http, $scope, GroupService){
    $scope.groups = {};
    $scope.groupUsers = {};

    $scope.newGroup;
    $scope.newUser;

    $scope.editingGroupID;

    socket.on('group-users-added', function(data) {
        var response = 'Dodales uzytkownika do grupy : ' + data.response;
        console.log(response);
        GroupService.getGroupUsers($scope.editingGroupID).then(function(data) {
            $scope.groupUsers = data;
        })
    });

    socket.on('group-users-removed', function(data) {
        var response = 'Dodales uzytkownika do grupy : ' + data.response;
        console.log(response);
        GroupService.getGroupUsers($scope.editingGroupID).then(function(data) {
            $scope.groupUsers = data;
        })
    });

    socket.on('group-deleted', function(data) {
        var response = 'Usunales grupe : ' + data.response;
        console.log(response);
        $scope.getGroups();
    });

    socket.on('group-created', function(data) {
        var response = 'Utworzyles grupe: ' + data.response;
        console.log(response);
        $scope.getGroups();
    });

    $scope.editGroup = function(groupID)
    {
        GroupService.getGroupUsers(groupID).then(function(data) {
            $scope.groupUsers = data;
            $scope.editingGroupID = groupID;
            $('#ModalerinoEdit').modal('show');
        })
    }

    $scope.deleteGroup = function(groupID)
    {
        var data = { 'groupID' : groupID}
        socket.emit('delete-group', data);
    }

    $scope.createGroup = function(groupName)
    {
        var data = { 'groupName' : groupName };
        socket.emit('create-group', data);
    }

    $scope.addUserToGroup = function(user)
    {
        var data = { 'groupID' : $scope.editingGroupID, users : [ user ]}
        socket.emit('add-group-users', data);
    }

    $scope.deleteUserFromGroup = function(user)
    {
        var data = { 'groupID' : $scope.editingGroupID, users : [ user ]}
        socket.emit('remove-group-users', data);
    }

    $scope.getGroups = function()
    {
        GroupService.getGroupsOwner().then(function(data) {
            $scope.groups = data;
        })
    }

});