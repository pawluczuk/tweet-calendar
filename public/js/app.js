'use strict';

var tweetCalendarApp = angular.module('tweetCalendarApp', ['tweetCalendarApp.controllers', 'tweetCalendarApp.services']);

var socket = io.connect();

angular.module('tweetCalendarApp.controllers', []);
angular.module('tweetCalendarApp.services', []);