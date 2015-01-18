module.exports = function(io, query) {
	return {
		notify : function(data, connectedUsers, socket) {
			console.log(data)
			if (invalid(data)) return;
			var filter = filterUsers(data.users, connectedUsers);
			var connected = filter.connectedUsers;
			var disconnected = filter.disconnectedUsers;

			notifyConnected(data.eventID, connected, io);
			notifyDisconnected(data.eventID, disconnected, query);
		}
	};
};

function invalid(data) {
	return !data || !data.eventID || !data.users || !data.users.length;
}

function filterUsers(userIDs, connectedUsers) {
	var obj = {};
	obj.connectedUsers = [];
	obj.disconnectedUsers = [];
	for (var i = 0; i < userIDs.length; i++) {
		if (connectedUsers[userIDs[i]])
			obj.connectedUsers.push(connectedUsers[userIDs[i]]);
		else
			obj.disconnectedUsers.push(userIDs[i]);
	}
	console.log(obj);
	return obj;
}

function notifyConnected(eventID, connectedSockets, io) {
	msg = {};
	msg.eventID = eventID;
	for (var i = 0; i < connectedSockets.length; i++) {
		io.sockets.connected[connectedSockets[i]].emit('user-added', msg);
	}
}

function notifyDisconnected(eventID, disconnectedUsers, query) {
	if (!disconnectedUsers || !disconnectedUsers.length) return;
	var message = 'Zostales dodany do wydarzenia.';
	var statement = 'insert into "notification" values ';
	for (var i = 0; i < disconnectedUsers.length; i++) {
 		statement += "(DEFAULT," + disconnectedUsers[i] + "," + 
 			eventID + ", now()::timestamp, '" + message + "')";

 		if (i !== disconnectedUsers.length - 1) statement += ', ';
	}
	query(statement, function(err, rows, result) {
    	if (err) console.log(err);
    });
}