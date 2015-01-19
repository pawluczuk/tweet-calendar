module.exports = function(io, query) {
	return {
		addEmails : function(data, callback) {
			if (invalid(data)) {
				callback(false);
				return;
			}
			var usersStatement = get_users_statement(data.users);

			query('BEGIN TRANSACTION', function (err) {
				if (err) rollback(query, callback);
				query(usersStatement, function(err, rows, result) {
					if (err || !rows || !rows.length) rollback(query, callback);
					else {
						var insertStatement = add_users_statement(data.groupID, rows);
						query(insertStatement, function(err, rows, result) {
							if (err) rollback(query, callback);
							query('END TRANSACTION',
			        			function(err) {
			        				if (err) rollback(query, callback);
			        				else {
			        					callback(true);
			        				}
			        		});
						});
					}
				});
			});
		}
	};
};

function invalid(data) {
	return !data || !data.groupID || !data.users.length;
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

function add_users_statement(group_id, userIDs) {
	var statement = 'insert into "user_group" values ';
 	for (var i = 0; i < userIDs.length; i++)
 	{
 		statement += '(' + group_id + ',' + userIDs[i].user_id + ')';
 		if (i !== userIDs.length - 1) statement += ', ';
 	}
 	return statement;
}

function rollback(query, callback) {
  query('ROLLBACK', function(err) {
    if (err) {
		callback(false);
		return;
	}
  });
}