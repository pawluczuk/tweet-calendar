module.exports = function(io, query) {
	return {
		createGroup : function(data, callback) {
			if (valid(data)) {
				callback(false);
				return;
			}
			var groupName = data.groupName;
			var ownerID = data.ownerID;
			var userIDs = data.groupUsers;
			var result = query('insert into "group" values (DEFAULT, $1::int, $2::text) returning group_id', 
				[ownerID, groupName], 
			    function(err, rows, result) {
			    	if (err) {
			    		callback(false);
			    		return;
			    	}
			    	if (rows && rows[0] && rows[0].group_id) {
			    		var statement = user_group_statement(rows[0].group_id, userIDs);
			    		query(statement, function(err, rows, result) {
			    			if (!err)
			    				callback(true);
			    			else
			    				callback(false);
			    		});
			    	}
			    });
		}
	};
};

function valid(data) {
	return !data || !data.groupName || !data.ownerID || 
				!data.groupUsers || !data.groupUsers.length;
}

function user_group_statement(group_id, userIDs) {
	var statement = 'insert into "user_group" values ';
	for (var i = 0; i < userIDs.length; i++)
	{
		statement += '(' + group_id + ',' + userIDs[i] + ')';
		if (i !== userIDs.length - 1) statement += ', ';
	}
	return statement;
}