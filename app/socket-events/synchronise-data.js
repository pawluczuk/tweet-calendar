module.exports = function(io, query) {
	return {
		synchroniseNotifications : function(userID, callback) {
			if (!userID) {
				callback(false);
				return;
			}
			query('select * from "notification" where user_id = $1::int and date < now()::timestamp',
				[userID], function (err, rows, result) {
					if (err) {
						callback(false);
						return;
					}
					else {
						callback(true, rows);
						return;
					}
				});
		},
		removeNotifications : function(userID) {
			if (!userID) {
				return;
			}
			query('delete from "notification" where user_id = $1::int and date < now()::timestamp',
				[userID], function (err, rows, result) {
					if (err) {
						console.log(err);
						return;
					}
				});
		}
	};
};