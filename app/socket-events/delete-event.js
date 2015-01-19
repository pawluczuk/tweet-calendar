module.exports = function(io, query) {
	return {
		deleteEvent : function (data, callback) {
			if (!data || !data.eventID) {
				callback(false);
				return;
			}
			query('BEGIN TRANSACTION', function (err) {
				if (err)  {
					rollback(query, callback);
					console.log(err);
					return;
				}
				query('delete from "tweet" where event_id = $1::int', [data.eventID],
                function(err, rows, result) {
                    if (err)  {
						rollback(query, callback);
						console.log(err);
						return;
					}
			        query('delete from "event_user" where event_id = $1::int returning user_id', [data.eventID],
				        function(err, rows, result) {
					        if (err)  {
								rollback(query, callback);
								console.log(err);
								return;
							}
					        var deletedUsers = rows;
					        query('delete from "notification" where event_id = $1::int', [data.eventID],
					        	function(err, rows, result) {
					        		if (err)  {
										rollback(query, callback);
										console.log(err);
										return;
									}
					        		query('delete from "event_group" where event_id = $1::int', [data.eventID],
							        	function(err, rows, result) {
							        		if (err)  {
												rollback(query, callback);
												console.log(err);
												return;
											}
							        		query('delete from "event" where event_id = $1::int', [data.eventID],
							        			function(err, rows, result) {
							        				if (err)  {
														rollback(query, callback);
														console.log(err);
														return;
													}
							        				query('END TRANSACTION',
									        			function(err) {
									        				if (err)  {
																rollback(query, callback);
																console.log(err);
																return;
															}
									        				else {
									        					callback(true, deletedUsers);
									        				}
									        		});
							        		});
							        });
					        });
		        	});
              	});
			});
		}
	};
};

function rollback(query, callback) {
  query('ROLLBACK', function(err) {
    if (err) {
		callback(false);
		return;
	}
  });
}