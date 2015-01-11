module.exports = function(io, query) {
	return {
		notify : function(data, eventID, connectedUsers, socket) {
			if (invalid(data)) return;
			var filter = filterUsers(data.additionalUsers, connectedUsers);
			var connected = filter.connectedUsers;
			var disconnected = filter.disconnectedUsers;
			notifyConnected(eventID, data.sender, connected, io);
			notifyDisconnected(eventID, disconnected, query);
			notifyRecipient(eventID, data.sender, data.recipient, connected, io, query);
		}
	};
};

function notifyConnected(eventID, senderID, connectedSockets, io) {
	msg = {};
	msg.eventID = eventID;
	msg.sender = senderID;
	msg.invitationType = 'additional';
	for (var i = 0; i < connectedSockets.length; i++) {
		io.sockets.connected[connectedSockets[i]].emit('new-event', msg);
	}
}

function notifyDisconnected(eventID, disconnectedUsers, query) {
	var message = 'Nowe wydarzenie dla Ciebie.';
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

function notifyRecipient(eventID, senderID, recipientID, connectedUsers, io, query) {
	msg = {};
	msg.eventID = eventID;
	msg.sender = senderID;
	msg.invitationType = 'recipient';
	if (connectedUsers[recipientID])
		io.sockets.connected[connectedUsers[recipientID]].emit('new-event', msg);
	else
		saveRecipientNotification(recipientID, eventID, query);
}

function saveRecipientNotification(recipientID, eventID, query) {
	var message = "Nowe wydarzenie.";
	query('insert into "notification" values (DEFAULT, $1::int, $2::int, now()::timestamp, $3::text) returning notification_id', 
		[recipientID, eventID, message], 
	    function(err, rows, result) {
	    	if (err) console.log(err);
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

function invalid(data) {
	return !data || !data.recipient || !data.sender;
}