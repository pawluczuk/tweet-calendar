var socketUser = {};
var userSocket = {};

module.exports = function(io, sessionStore, passportSocketIo, passport, express, query) {
	// supported actions
	var newEvent = require('./socket-events/create-event.js')(io, query);
	var editEvent = require('./socket-events/edit-event.js')(io, query);
	var acceptEvent = require('./socket-events/accept-event.js')(io, query);
	var newGroup = require('./socket-events/create-group.js')(io, query);
	var deleteEvent = require('./socket-events/delete-event.js')(io, query);
	var deleteGroup = require('./socket-events/delete-group.js')(io, query);
	var addUsers = require('./socket-events/add-users.js')(io, query);
	var addGroup = require('./socket-events/add-group.js')(io, query);
	var addEmails = require('./socket-events/add-emails.js')(io, query);
	var deleteUsers = require('./socket-events/delete-users.js')(io, query);
	var deleteCons = require('./socket-events/delete-cons.js')(io, query);
	var addGroupUsers = require('./socket-events/add-group-users.js')(io, query);
	var deleteGroupEvent = require('./socket-events/delete-group-event.js')(io, query);
	var newTweet = require('./socket-events/add-tweet.js')(io, query);
	var deleteTweet = require('./socket-events/delete-tweet.js')(io, query);
	var removeGroupUsers = require('./socket-events/remove-group-users.js')(io, query);

	// supported actions' notifications
	var newEventNotification = require('./socket-events/create-event-notification.js')(io, query);
	var editEventNotification = require('./socket-events/edit-event-notification.js')(io, query);
	var addUsersNotification = require('./socket-events/add-users-notification.js')(io, query);
	var deleteUsersNotification = require('./socket-events/delete-users-notification.js')(io, query);
	var synchroniseData = require('./socket-events/synchronise-data.js')(io, query);
	
	io.use(passportSocketIo.authorize({
	  	cookieParser: 	express.cookieParser,
	  	key: 			'express.sid',
	  	store: 			sessionStore,
	  	secret: 		'sessionsecret',
	  	success:     	onAuthorizeSuccess,
	  	fail:        	onAuthorizeFail,
	  	passport: 		passport 
	}));

	// user connected
	io.on('connection', function(socket) {
		console.log('Connected user with ID: ' + socket.request.user.id);

		socketUser[socket.id] = socket.request.user.id;
		userSocket[socket.request.user.id] = socket.id;

		synchroniseData.synchroniseNotifications(socket.request.user.id, 
			function(result, synchData) {
				if (result && synchData)
					socket.emit('send-notifications', { data : synchData });
		});

		/*socket.on('notifications-received', function(data) {
			synchroniseData.removeNotifications(socket.request.user.id);
		});*/

		// user disconnected
		socket.on('disconnect', function () {
			console.log('Disconnected user with ID: ' + socket.request.user.id);
			// remove client from the list of connected users
			delete userSocket[socket.request.user.id];
		    delete socketUser[socket.id];
		});

		// new group created by user
		socket.on('create-group', function(data) {
			if (data) {
				newGroup.createGroup(socket.request.user.id, data, function(result) {
					if (result)
						socket.emit('group-created', { response : 'true'});
					else
						socket.emit('group-created', { response : 'false'});
				});
			}
		});

		// delete existing group
		socket.on('delete-group', function(data) {
			if (data) {
				deleteGroup.deleteGroup(data, function(result) {
					if (result)
						socket.emit('group-deleted', { response : 'true'});
					else
						socket.emit('group-deleted', { response : 'false'});
				});
			}
		});

		// add users identified by email to existing group
		socket.on('add-group-users', function(data) {
			if (data) {
				addGroupUsers.addEmails(data, function(result) {
					if (result) {
						socket.emit('group-users-added', { response : 'true'});
					}
					else
						socket.emit('group-users-added', { response : 'false'});
				});
			}
		});

		// delete users identified by id from existing group
		socket.on('remove-group-users', function(data) {
			if (data) {
				removeGroupUsers.removeUsers(data, function(result) {
					if (result) {
						socket.emit('group-users-removed', { response : 'true'});
					}
					else
						socket.emit('group-users-removed', { response : 'false'});
				});
			}
		});

		// new event created by user
		socket.on('create-event', function(data) {
			if (data) {
				newEvent.createEvent(data, function(result, eventID) {
					if (result) {
						socket.emit('event-created', { response : 'true'});
						newEventNotification.notify(data, eventID, userSocket, socket);
					}
					else
						socket.emit('event-created', { response : 'false'});
				});
			}
		});

		// new event created by user
		socket.on('edit-event', function(data) {
			if (data) {
				editEvent.editEvent(data, function(result) {
					if (result) {
						socket.emit('event-edited', { response : 'true'});
						editEventNotification.notify(data.eventID, userSocket, socket);
					}
					else
						socket.emit('event-edited', { response : 'false'});
				});
			}
		});

		// accept event that user has been invited to
		socket.on('accept-event', function(data) {
			if (data) {
				acceptEvent.response(socket.request.user.id, data, function(result) {
					if (result) {
						socket.emit('event-accepted', { response : 'true'});
					}
					else
						socket.emit('event-accepted', { response : 'false'});
				});
			}
		});

		// delete existing event
		socket.on('delete-event', function(data) {
			if (data) {
				deleteEvent.deleteEvent(data, function(result, deletedUsers) {
					if (result) {
						socket.emit('event-deleted', { response : 'true'});
					}
					else
						socket.emit('event-deleted', { response : 'false'});
				});
			}
		});

		// add users to event
		socket.on('add-users', function (data) {
			if (data) {
				addUsers.addUsers(data, function(result) {
					if (result) {
						socket.emit('users-added', { response : 'true'});
						addUsersNotification.notify(data, userSocket, socket);
					}
					else
						socket.emit('users-added', { response : 'false'});
				});
			}
		});

		// add group to event
		socket.on('add-group', function (data) {
			if (data) {
				addGroup.addGroup(data, function(result, userIDs) {
					if (result) {
						socket.emit('group-added', { response : 'true'});
						data.users = userIDs;
						addUsersNotification.notify(data, userSocket, socket);
					}
					else
						socket.emit('group-added', { response : 'false'});
				});
			}
		});

		// delete group from existing event
		socket.on('delete-group-event', function (data) {
			if (data) {
				deleteGroupEvent.deleteGroup(data, function(result, userIDs) {
					if (result) {
						socket.emit('group-event-added', { response : 'true'});
						data.users = userIDs;
						deleteUsersNotification.notify(data, userSocket, socket);
					}
					else
						socket.emit('group-event-added', { response : 'false'});
				});
			}
		});

		// add users to event by their emails
		socket.on('add-emails', function (data) {
			if (data) {
				addEmails.addEmails(data, function(result, userIDs) {
					if (result) {
						socket.emit('emails-added', { response : 'true'});
						data.users = userIDs;
						addUsersNotification.notify(data, userSocket, socket);
					}
					else
						socket.emit('emails-added', { response : 'false'});
				});
			}
		});

		// delete users from event
		socket.on('delete-users', function (data) {
			if (data) {
				deleteUsers.deleteUsers(data, function(result) {
					if (result) {
						socket.emit('users-deleted', { response : 'true'});
						deleteUsersNotification.notify(data, userSocket, socket);
					}
					else
						socket.emit('users-deleted', { response : 'false'});
				});
			}
		});

		// add tweets to event
		socket.on('add-tweet', function (data) {
			if (data) {
				newTweet.tweet(socket.request.user.id, data, function(result, userIDs) {
					if (result) {
						socket.emit('tweet-added', { response : 'true'});
						editEventNotification.tweet(data.eventID, userSocket, socket);
					}
					else
						socket.emit('tweet-added', { response : 'false'});
				});
			}
		});

		// add tweets to event
		socket.on('delete-tweet', function (data) {
			if (data) {
				deleteTweet.tweet(data, function(result) {
					if (result) {
						socket.emit('tweet-deleted', { response : 'true'});
					}
					else
						socket.emit('tweet-deleted', { response : 'false'});
				});
			}
		});

	});
};

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');
  accept();
}

function onAuthorizeFail(data, message, error, accept){
  console.log('failed connection to socket.io:', message);
  if(error)
    accept(new Error(message));
}