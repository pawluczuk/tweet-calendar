module.exports = function(io, query) {
	return {
		notify : function(data, deletedUsers, connectedUsers, socket) {
			if (invalid(data)) return;
			console.log(deletedUsers);
			var event_id = data.eventID;
			var filter = filterUsers(deletedUsers, connectedUsers);
			var connected = filter.connectedUsers;
			var disconnected = filter.disconnectedUsers;
			console.log(connected);
			console.log(disconnected);
		}
	};
};

function invalid(data) {
	return !data || !data.eventID;
}

function filterUsers(deletedUsers, connectedUsers) {
	if (!deletedUsers || deletedUsers.length) return;
	var obj = {};
	obj.connectedUsers = [];
	obj.disconnectedUsers = [];

	for (var i = 0; i < deletedUsers.length; i++) {
		if (connectedUsers[deletedUsers[i].user_id])
			obj.connectedUsers.push(connectedUsers[deletedUsers[i].user_id]);
		else 
			obj.disconnectedUsers.push(deletedUsers[i].user_id);
	}
	return obj;
}