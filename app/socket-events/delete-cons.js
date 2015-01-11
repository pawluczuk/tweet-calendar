module.exports = function(io, query) {
	return {
		deleteEvent : function (data, callback) {
			if (!data || !data.eventID) {
				callback(false);
				return;
			}
			query('delete from "event_user" where event_id = $1::int returning user_id', [data.eventID], 
				function(err, rows, result) {
					if (err) {
						callback(false);
						return;
					}
					var deletedUsers = rows;
					query('delete from "notification" where event_id = $1::int', [data.eventID],
						function(err, rows, result) {
							if (err) {
								callback(false);
								return;
							}
							query('delete from "event" where event_id = $1::int', [data.eventID], 
								function(err, rows, result) {
									if (err) {
										callback(false);
									}
									else {
										callback(true, deletedUsers);
									}
								});
						});
			});
		}
	};
};
