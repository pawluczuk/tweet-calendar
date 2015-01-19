module.exports = function(io, query) {
	return {
		createEvent : function(data, callback) {
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
				query('insert into "event" values (DEFAULT, $1::int, $2, $3::text, $4::text, $5, $6, now()::timestamp) returning event_id',
					[data.ownerId, data.type, data.name, data.description, data.start, data.end],
					function(err, rows, result) {
						if (err || !rows || !rows[0] || !rows[0].event_id)  {
							rollback(query, callback);
							console.log(err);
							return;
						}
						var eventID = rows[0].event_id;
						var statement = event_user_statement(eventID, data.additionalUsers);
						query(statement, function(err, rows, result) {
							query('END TRANSACTION',
			        			function(err) {
			        				if (err)  {
										rollback(query, callback);
										console.log(err);
										return;
									}
			        				else {
			        					callback(true, eventID);
			        				}
			        		});
						});
				});
			});
		}
	};
};

function invalid(data) {
	return 	!data || !data.ownerId || !data.type ||
			!data.name || !data.description ||
			!data.start || !data.end;
}

function event_user_statement(event_id, userIDs) {
	if (!userIDs || userIDs.length) return;
 	var statement = 'insert into "event_user" values ';
 	for (var i = 0; i < userIDs.length; i++)
 	{
 		statement += '(' + event_id + ',' + userIDs[i] + ', DEFAULT)';
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