angular.module('tweetCalendarApp.services').factory('EventService', function($http) {
	var factory = {};

	factory.getEventInfo = function(eventID) {
		var war = $http.get("/resources/eventsByID?eventID=" + eventID).then(function(result) {
			console.log(result.data[0]);
			return result.data;
		});
		console.log(war);
		return war;
	};
	
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
	
	return factory;
});