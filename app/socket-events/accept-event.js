module.exports = function(io, query) {
	return {
		response : function(userID, data, callback) {
			if (invalid(data)) {
				callback(false);
				return;
			}
			if (data.response === true) 
				query('update "event_user" set accepted = true where event_id = $1::int and user_id = $2::int', 
					[data.eventID, userID], function(err, rows, result) {
						if (err) {
							callback(false);
							return;
						}
						else callback(true);
					});
			else if (data.response === true)
				removeEvent(data.eventID, userID, query);
		}
	};
};

function removeEvent(eventID, userID, query) {
	query('delete from "event_user" where event_id = $1::int and user_id = $2::int',
		[eventID, userID], function(err, rows, result) {
			callback(false);
		});
}

function invalid(data) {
	return !data || !data.eventID || !data.response;
}