module.exports = function(io, query) {
	return {
		notify : function(eventID, connectedUsers, socket) {
			if (!eventID) return;
			query ('select user_id from "event_user" where event_id = $1::int', [eventID],
				function(err, rows, result) {
					if (err || !rows) return;

					else {
						var filter = filterUsers(rows, connectedUsers);
						var connected = filter.connectedUsers;
						var disconnected = filter.disconnectedUsers;
						notifyConnected(eventID, connected, io);
						notifyDisconnected(eventID, disconnected, query);
					} 
				});
		},
		tweet : function(eventID, connectedUsers, socket) {
			if (!eventID) return;
			query ('select user_id from "event_user" where event_id = $1::int', [eventID],
				function(err, rows, result) {
					if (err || !rows) return;

					else {
						var filter = filterUsers(rows, connectedUsers);
						var connected = filter.connectedUsers;
						var disconnected = filter.disconnectedUsers;
						tweetConnected(eventID, connected, io);
						tweetDisconnected(eventID, disconnected, query);
					} 
				});
		}
	};
};

function notifyConnected(eventID, senderID, connectedSockets, io) {
	msg = {};
	msg.eventID = eventID;
	for (var i = 0; i < connectedSockets.length; i++) {
		io.sockets.connected[connectedSockets[i]].emit('edited-event', msg);
	}
}

function notifyDisconnected(eventID, disconnectedUsers, query) {
	if (!disconnectedUsers || !disconnectedUsers.length) return;
	var message = 'Edytowano wydarzenie.';
	var statement = 'insert into "notification" values ';
	for (var i = 0; i < disconnectedUsers.length; i++) {
 		statement += "(DEFAULT," + disconnectedUsers[i] + "," + 
 			eventID + ", now()::timestamp, '" + message + "')";

 		if (i !== disconnectedUsers.length - 1) statement += ', ';
	}
	query(statement, function(err, rows, result) {
    	if (err) console.log("Notify disconnected (edit event) error: " + err);
    });
}

function tweetConnected(eventID, senderID, connectedSockets, io) {
	msg = {};
	msg.eventID = eventID;
	for (var i = 0; i < connectedSockets.length; i++) {
		io.sockets.connected[connectedSockets[i]].emit('new-tweet', msg);
	}
}

function tweetDisconnected(eventID, disconnectedUsers, query) {
	if (!disconnectedUsers || !disconnectedUsers.length) return;
	var message = 'Nowy tweet do wydarzenia.';
	var statement = 'insert into "notification" values ';
	for (var i = 0; i < disconnectedUsers.length; i++) {
 		statement += "(DEFAULT," + disconnectedUsers[i].user_id + "," + 
 			eventID + ", now()::timestamp, '" + message + "')";

 		if (i !== disconnectedUsers.length - 1) statement += ', ';
	}
	query(statement, function(err, rows, result) {
    	if (err) console.log("Notify new tweet disconnected (edit event) error: " + err);
    });
}

function filterUsers(additionalRecipients, connectedUsers) {
	if (!additionalRecipients) return;
	var obj = {};
	obj.connectedUsers = [];
	obj.disconnectedUsers = [];

	for (var i = 0; i < additionalRecipients.length; i++) {
		if (connectedUsers[additionalRecipients[i]])
			obj.connectedUsers.push(connectedUsers[additionalRecipients[i]]);
		else 
			obj.disconnectedUsers.push(additionalRecipients[i]);
	}
	return obj;
}
