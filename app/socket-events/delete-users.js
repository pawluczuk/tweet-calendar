module.exports = function(io, query) {
	return {
		deleteUsers : function(data, callback) {
			if (invalid(data)) {
				callback(false);
				return;
			}
			var statement = delete_users_statement(data.eventID, data.users);
			query(statement, function(err, rows, result) {
				if (!err) callback(true);
				else callback(false);
			});
		}
	};
};

function invalid(data) {
	return !data || !data.eventID || !data.users.length;
}

function delete_users_statement(event_id, userIDs) {
	var statement = 'delete from "event_user" where event_id = ' + event_id + ' and user_id IN (';
 	for (var i = 0; i < userIDs.length; i++)
 	{
 		statement += userIDs[i];
 		if (i !== userIDs.length - 1) statement += ', ';
 	}
 	statement += ')';
 	return statement;
}