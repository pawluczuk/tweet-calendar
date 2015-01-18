module.exports = function(io, query) {
	return {
		notify : function(data, connectedUsers, socket) {
			if (invalid(data)) return;
			var connected = filterUsers(data.users, connectedUsers);

			notifyConnected(data.eventID, connected, io);
			notifyDb(data.eventID, data.users, query);
		}
	};
};

function invalid(data) {
	return !data || !data.eventID || !data.users || !data.users.length;
}

function filterUsers(userIDs, connectedUsers) {
	var usersArray = [];
	for (var i = 0; i < userIDs.length; i++) {
		if (connectedUsers[userIDs[i]])
			usersArray.push(connectedUsers[userIDs[i]]);
	}
	return usersArray;
}

function notifyConnected(eventID, connectedSockets, io) {
	msg = {};
	msg.eventID = eventID;
	for (var i = 0; i < connectedSockets.length; i++) {
		io.sockets.connected[connectedSockets[i]].emit('user-added', msg);
	}
}

function notifyDb(eventID, users, query) {
	if (!users || !users.length) return;
	var message = 'Zostales dodany do wydarzenia.';
	var statement = 'insert into "notification" values ';
	for (var i = 0; i < users.length; i++) {
 		statement += "(DEFAULT," + users[i] + "," + 
 			eventID + ", now()::timestamp, '" + message + "')";

 		if (i !== users.length - 1) statement += ', ';
	}
	query(statement, function(err, rows, result) {
    	if (err) console.log(err);
    });
}