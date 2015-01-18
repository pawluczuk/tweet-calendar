module.exports = function(io, query) {
	return {
		editEvent : function(data, callback) {
			if (invalid(data)) {
				callback(false);
				return;
			}
			var stmt = insert_event_stmt(data);
			query(stmt,	function(err, rows, result) {
					if (err) {
						console.log("Insert event statement error: " + err);
						callback(false);
						return;
					}
					else callback(true);
				});
		}
	};
};

function invalid(data) {
	return 	!data || !data.eventID;
}

function insert_event_stmt(data) {
	var statement = 'update "event" set ';
	statement += (!data.eventName) ? "" : "name = '" + data.eventName + "', ";
	statement += (!data.eventType) ? "" : "type_code = '" + data.eventType + "', ";
	statement += (!data.start) ? "" : "start_date = '" + data.start + "', ";
	statement += (!data.end) ? "" : "end_date = '" + data.end + "', ";
	statement += (!data.comment) ? "" : "description = '" + data.comment + "', ";
	statement += 'edit_date = now()::timestamp where event_id = ' + data.eventID;
	return statement;
}