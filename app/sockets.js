var socketUser = {};
var userSocket = {};

module.exports = function(io, passport, query) {

	var newEvent = require('./socket-events/create-event.js')(io, query);
	var newGroup = require('./socket-events/create-group.js')(io, query);
	var deleteEvent = require('./socket-events/delete-event.js')(io, query);
	var eventNotification = require('./socket-events/event-notification.js')(io, query);
	var addUsers = require('./socket-events/add-users.js')(io, query);
	// user connected
	io.on('connection', function(socket) {
		// ask newly connected user for its ID
		socket.emit('id-request', {});

		// user ID received
		socket.on('id-response', function(data) {
			if (data && data.userID)
				console.log('New user connected with ID: ' + data.userID);
				socketUser[socket.id] = data.userID;
				userSocket[data.userID] = socket.id;
		});

		// user disconnected
		socket.on('disconnect', function () {
			console.log('Disconnected user with ID: ' + socketUser[socket.id]);
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
						eventNotification.notify(data, eventID, userSocket, socket);
					}
					else
						socket.emit('event-created', { response : 'false'});
				});
			}
		});

		socket.on('delete-event', function(data) {
			if (data) {
				deleteEvent.deleteEvent(data, function(result) {
					if (result)
						socket.emit('event-deleted', { response : 'true'});
					else
						socket.emit('event-deleted', { response : 'false'});
				});
			}
		});

		socket.on('add-users', function (data) {
			if (data) {
				addUsers.addUsers(data, function(result) {
					if (result)
						socket.emit('users-added', { response : 'true'});
					else
						socket.emit('users-added', { response : 'false'});
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