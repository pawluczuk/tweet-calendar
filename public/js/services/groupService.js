angular.module('tweetCalendarApp.services').factory('GroupService', function($http) {
	var factory = {};

	factory.getGroupsOwner = function() {
		return $http.get("/resources/groupsOwner").then(function(result) {
			return result.data;
		});
	};

	factory.getGroupUsers = function(groupID) {
		return $http.get("/resources/groupUsers?groupID=" + groupID).then(function(result) {
			return result.data;
		});
	};

	return factory;
});