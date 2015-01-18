module.exports = function(io, query) {
	return {
		addGroup : function(data, callback) {
			if (invalid(data)) {
				callback(false);
				return;
			}
			query('select user_id from "user_group" where group_id = $1::int', [data.groupID],
				function(err, rows, result) {
					if (err) {
						callback(false);
						return;
					}
					else if (rows && rows.length) {
						var users = rows;
						var userIds = getUsersArray(rows);
						var statement = add_users_statement(data.eventID, rows);
						query(statement, function(err, rows, result) {
							if (err) {
								callback(false);
								return;
							}
							else {
								query('insert into "event_group" values ($1::int,$2::int)',
									[data.eventID, data.groupID], function(err, rows, result) {
										if (err) callback(false);
										else callback(true, userIds);
									});
							}
						});
					}
				});			
		}
	};
};

function getUsersArray(users) {
	var array = [];
	for (var i = 0; i < users.length; i++) {
		array.push(users[i].user_id);
	}
	return array;
}

function invalid(data) {
	return !data || !data.eventID || !data.groupID;
}

function add_users_statement(event_id, users) {
	var statement = 'insert into "event_user" values ';
 	for (var i = 0; i < users.length; i++)
 	{
 		statement += '(' + event_id + ',' + users[i].user_id + ', DEFAULT)';
 		if (i !== users.length - 1) statement += ', ';
 	}
 	return statement;
}