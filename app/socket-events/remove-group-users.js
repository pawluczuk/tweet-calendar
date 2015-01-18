module.exports = function(io, query) {
	return {
		removeUsers : function(data, callback) {
			if (invalid(data)) {
				callback(false);
				return;
			}
			var usersStatement = delete_users_statement(data.groupID, data.users);
			query(usersStatement, function(err, rows, result) {
				if (err) {
					callback(false);
					return;
				}
				else callback(true);
			});
		}
	};
};

function invalid(data) {
	return !data || !data.groupID || !data.users.length;
}

function delete_users_statement(group_id, userIDs) {
	var statement = 'delete from "user_group" where group_id = ' + group_id + ' and user_id in (';
 	for (var i = 0; i < userIDs.length; i++)
 	{
 		statement += userIDs[i];
 		if (i !== userIDs.length - 1) statement += ', ';
 	}
 	statement += ')';
 	return statement;
}