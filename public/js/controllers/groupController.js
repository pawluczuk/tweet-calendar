angular.module('tweetCalendarApp.controllers').controller('GroupCtrl', function($http, $scope, GroupService){
    $scope.groups = {};
    $scope.groupUsers = {};

    $scope.newGroup;
    $scope.newUser;

    $scope.editGroup = function(groupID)
    {
        GroupService.getGroupUsers(groupID).then(function(data) {
            $scope.groupUsers = data;
            $('#ModalerinoEdit').modal('show');
        })
    }

    $scope.deleteGroup = function(groupID)
    {
        console.log(groupID);
    }

    $scope.createGroup = function(groupName)
    {
        var data = { 'groupName' : groupName };
        socket.emit('create-group', data);
    }

    $scope.addUserToGroup = function(username)
    {
        console.log(username);
    }

    $scope.getGroups = function()
    {
        GroupService.getGroupsOwner().then(function(data) {
            $scope.groups = data;
        })
    }

});