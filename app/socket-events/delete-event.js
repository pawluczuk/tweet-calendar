module.exports = function(io, query) {
	return {
		deleteEvent : function (data, callback) {
			if (!data || !data.eventID) {
				callback(false);
				return;
			}
			query('delete from "event_user" where event_id = $1::int', [data.eventID], 
				function(err, rows, result) {
					if (err) {
						callback(false);
						return;
					}
					query('delete from "event" where event_id = $1::int', [data.eventID], 
					function(err, rows, result) {
						if (err) {
							callback(false);
							//return;
						}
						else {
							callback(true);
							//return;
						}
					});
			});
		}
	};
};