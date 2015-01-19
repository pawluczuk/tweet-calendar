module.exports = function(io, query) {
	return {
		deleteGroup : function(data, callback) {
			if (invalid(data)) {
				callback(false);
				return;
			}

			query('BEGIN TRANSACTION', function (err) {
				if (err)  {
					rollback(query, callback);
					console.log(err);
					return;
				}
			});

			query('select user_id from "user_group" where group_id = $1::int', [data.groupID],
				function(err, rows, result) {
					if (err || !rows || !rows.length)  {
						rollback(query, callback);
						console.log(err);
						return;
					}
					
					var users = rows;
					var userIds = getUsersArray(rows);
					var statement = delete_users_statement(data.eventID, rows);
					query(statement, function(err, rows, result) {
						if (err)  {
							rollback(query, callback);
							console.log(err);
							return;
						}
						else {
							query('delete from "event_group" where event_id = $1::int and group_id = $2::int',
								[data.eventID, data.groupID], function(err, rows, result) {
									if (err)  {
										rollback(query, callback);
										console.log(err);
										return;
									}
									query('END TRANSACTION',
					        			function(err) {
					        				if (err)  {
												rollback(query, callback);
												console.log(err);
												return;
											}
					        				else {
					        					callback(true, userIds);
					        				}
					        		});
								});
						}
					});
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

function delete_users_statement(event_id, users) {
	var statement = 'delete from "event_user" where event_id = ' +  event_id + ' and user_id in (';
 	for (var i = 0; i < users.length; i++)
 	{
 		statement += users[i].user_id;
 		if (i !== users.length - 1) statement += ', ';
 	}
 	statement += ')';
 	return statement;
}