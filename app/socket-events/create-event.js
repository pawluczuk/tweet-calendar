module.exports = function(io, query) {
	return {
		createEvent : function(data, callback) {
			if (validate(data)) {
				callback(false);
				return;
			}

			query('insert into "event" values (DEFAULT, $1::int, $2, $3::text, $4::text, $5, $6, now()::timestamp) returning event_id',
				[data.sender, data.eventType, data.eventName, data.comment, data.start, data.end],
				function(err, rows, result) {
					if (err) {
						callback(false);
						return;
					}
					if (!err && rows && rows[0] && rows[0].event_id) {
						var statement = event_user_statement(rows[0].event_id, data.additionalUsers);
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

function validate(data) {
	return 	!data || !data.eventName || !data.eventType ||
			!data.start || !data.end || !data.additionalUsers || 
			!data.comment || !data.recipient || !data.sender;
}

function event_user_statement(event_id, userIDs) {
 	var statement = 'insert into "event_user" values ';
 	for (var i = 0; i < userIDs.length; i++)
 	{
 		statement += '(' + event_id + ',' + userIDs[i] + ')';
 		if (i !== userIDs.length - 1) statement += ', ';
 	}
 	return statement;
}