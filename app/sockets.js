var socketUser = {};
var userSocket = {};

module.exports = function(io, passport, query) {
	// supported actions
	var newEvent = require('./socket-events/create-event.js')(io, query);
	var newGroup = require('./socket-events/create-group.js')(io, query);
	var deleteEvent = require('./socket-events/delete-event.js')(io, query);
	var addUsers = require('./socket-events/add-users.js')(io, query);
	var deleteUsers = require('./socket-events/delete-users.js')(io, query);
	var deleteCons = require('./socket-events/delete-cons.js')(io, query);

	// supported actions' notifications
	var newEventNotification = require('./socket-events/create-event-notification.js')(io, query);
	//var deleteEventNotification = require('./socket-events/delete-event-notification.js')(io, query);
	var addUsersNotification = require('./socket-events/add-users-notification.js')(io, query);
	var deleteUsersNotification = require('./socket-events/delete-users-notification.js')(io, query);
	//var deleteConsNotification = reuqire('./socket-events/delete-cons-notification.js')(io, query);
	var synchroniseData = require('./socket-events/synchronise-data.js')(io, query);
	
	// user connected
	io.on('connection', function(socket) {
		// ask newly connected user for its ID
		socket.emit('id-request', {});

		// user ID received
		socket.on('id-response', function(data) {
			if (data && data.userID)
			{
				console.log('New user connected with ID: ' + data.userID);
				socketUser[socket.id] = data.userID;
				userSocket[data.userID] = socket.id;
				synchroniseData.synchroniseNotifications(data.userID, function(result, synchData) {
					if (result && synchData)
						socket.emit('send-notifications', { data : synchData });
				});
			}
		});

		socket.on('notifications-received', function(data) {
			synchroniseData.removeNotifications(socketUser[socket.id]);
		});

		// user disconnected
		socket.on('disconnect', function () {
			console.log('Disconnected user with ID: ' + socketUser[socket.id]);
			// TODO : uniewaznic sesje passport
			// remove client from the list of connected users
			delete userSocket[socketUser[socket.id]];
		    delete socketUser[socket.id];
		});

		// new group created by user
		socket.on('create-group', function(data) {
			if (data) {
				newGroup.createGroup(data, function(result) {
					if (result)
						socket.emit('group-created', { response : 'true'});
					else
						socket.emit('group-created', { response : 'false'});
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

		socket.on('delete-event', function(data) {
			if (data) {
				deleteEvent.deleteEvent(data, function(result, deletedUsers) {
					if (result) {
						socket.emit('event-deleted', { response : 'true'});
						//deleteEventNotification.notify(data, deletedUsers, userSocket, socket);
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

		// test event
		socket.on('monaEvent', function(data) {
			console.log(data);
			socket.emit('response', { hello: 'Przestan to klikac!' });
		});
	});
};

function findClientsSocket(io, roomId, namespace) {
    var res = [], ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId) ;
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}