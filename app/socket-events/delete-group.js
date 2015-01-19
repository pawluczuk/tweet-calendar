module.exports = function(io, query) {
	return {
		deleteGroup : function (data, callback) {
			if (!data || !data.groupID) {
				callback(false);
				return;
			}
			query('BEGIN TRANSACTION', function (err) {
				if (err)  {
					rollback(query, callback);
					console.log(err);
					return;
				}
				query('delete from "event_group" where group_id = $1::int', [data.groupID],
	                function(err, rows, result) {
	                    if (err)  {
							rollback(query, callback);
							console.log(err);
							return;
						}
				        query('delete from "user_group" where group_id = $1::int', [data.groupID],
					        function(err, rows, result) {
						        if (err)  {
									rollback(query, callback);
									console.log(err);
									return;
								}
						        query('delete from "group" where group_id = $1::int', [data.groupID],
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
						        					callback(true);
						        				}
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