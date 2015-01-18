module.exports = function(io, query) {
	return {
		addEmails : function(data, callback) {
			if (invalid(data)) {
				callback(false);
				return;
			}

			var usersStatement = get_users_statement(data.users);
			query(usersStatement, function(err, rows, result) {
				if (err || !rows || !rows.length) {
					callback(false);
					return;
				}
				else {
					var userIds = getUsersArray(rows);
					var insertStatement = add_users_statement(data.eventID, rows);
					query(insertStatement, function(err, rows, result) {
						if (!err) callback(true, userIds);
						else callback(false);
					});
				}
			});
		}
	};
};

function invalid(data) {
	return !data || !data.eventID || !data.users.length;
}

function getUsersArray(originalArray) {
	var array = [];
	for (var i = 0; i < originalArray.length ; i++) {
		array.push(originalArray[i].user_id);
	}
	return array;
}

function get_users_statement(emails) {
	var statement = 'select user_id from "user" where email in (';
	for (var i = 0; i < emails.length; i++)
	{
		statement += "'" + emails[i] + "'";
		if (i !== emails.length - 1) statement += ', ';
	}
	statement += ')';

	return statement;
}

function add_users_statement(event_id, userIDs) {
	var statement = 'insert into "event_user" values ';
 	for (var i = 0; i < userIDs.length; i++)
 	{
 		statement += '(' + event_id + ',' + userIDs[i].user_id + ', DEFAULT)';
 		if (i !== userIDs.length - 1) statement += ', ';
 	}
 	return statement;
}