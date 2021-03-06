module.exports = function(io, query) {
	return {
		addUsers : function(data, callback) {
			if (invalid(data)) {
				callback(false);
				return;
			}
			var statement = add_users_statement(data.eventID, data.users);
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

function add_users_statement(event_id, userIDs) {
	var statement = 'insert into "event_user" values ';
 	for (var i = 0; i < userIDs.length; i++)
 	{
 		statement += '(' + event_id + ',' + userIDs[i] + ')';
 		if (i !== userIDs.length - 1) statement += ', ';
 	}
 	return statement;
}