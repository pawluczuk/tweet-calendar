angular.module('tweetCalendarApp.controllers').controller('GroupCtrl', function($http, $scope, GroupService){
    $scope.groups = {};
    $scope.groupUsers = {};

    $scope.newGroup;
    $scope.newUser;

    $scope.addGroup = function()
    {
        var data = { 'eventID' : $scope.eventInfo.event_id, 'groups' : [ groupName ]};
        console.log(data);
        socket.emit('add-groups', data);
    }

    $scope.addUserToGroup = function(userID)
    {

    }

    $scope.deleteGroup = function(groupID)
    {

    }

    $scope.getGroups = function()
    {
        GroupService.getGroupsOwner().then(function(data) {
            $scope.groups = data;
        })
    }

    $scope.getGroupUsers = function(groupID)
    {
        GroupService.getGroupUsers(groupID).then(function(data) {
            $scope.groupUsers = data;
        })
    }

});