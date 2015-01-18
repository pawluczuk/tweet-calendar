module.exports = function(io, query) {
	return {
		tweet : function(userID, data, callback) {
			if (!userID || invalid(data)) {
				callback(false);
				return;
			}
			query('insert into "tweet" values (DEFAULT, $1::int, $2::int, now()::timestamp, $3::text)', 
				[userID, data.eventID, data.message], function(err, rows, result) {
					if (err) {
						callback(false);
						return;
					}
					else {
						query('select user_id from "event_user" where event_id = $1::int', [data.eventID],
							function(err, rows, result) {
								if (err) {
									callback(false);
									return;
								}
								else {
									var userIds = getUsersArray(rows);
									callback(true, userIds);
								}
							});
					}
			});
		}
	};
};

function invalid(data) {
	return !data || !data.eventID || !data.message;
}

function getUsersArray(originalArray) {
	var array = [];
	for (var i = 0; i < originalArray.length ; i++) {
		array.push(originalArray[i].user_id);
	}
	return array;
}