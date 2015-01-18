angular.module('tweetCalendarApp.services').factory('EventService', function($http) {
	var factory = {};

	factory.getEventInfo = function(eventID) {
		return $http.get("/resources/eventsByID?eventID=" + eventID).then(function(result) {
			return result.data;
		});
	};

	factory.getUsers = function(eventID) {
		return $http.get("/resources/usersByEventID?eventID=" + eventID).then(function(result) {
			return result.data;
		});
	};

	return factory;

	/*
	// TO NA DOLE NIEWAZNE
	
	factory.projectExists = function(projectCode) {
		return $http.get("/project/projectExists?code=" + projectCode).then(function(result) {
			return result.data;
		});
	};
	
	factory.fetchAccountProjectsData = function() {
		return $http.get("/project/getAccountProjectsData").then(function(result) {
			return result.data;
		});
	};
	
	factory.fetchProjectInfo = function(projectCode) {
		return $http.get("/project/getProjectInfo?code=" + projectCode).then(function(result) {
			return result.data;
		});
	};
	
	factory.fetchDecisionProblems = function(projectCode) {
		return $http.get("/problem/getDecisionProblems?code=" + projectCode).then(function(result) {
			return result.data;
		});
	};
	
	factory.save = function(project) {
		return $http.post('/project/save', project).then(function(result) {
			return result.data;
		});
	};
	
	factory.delete = function(projectId) {
		return $http.post('/project/delete/', {projectId: projectId}).then(function (results) {
			return results.data;
		});
	};
	*/
});