module.exports = function(io, query) {
	return {
		deleteGroup : function (data, callback) {
			if (!data || !data.groupID) {
				callback(false);
				return;
			}
            query('delete from "event_group" where group_id = $1::int', [data.groupID],
                function(err, rows, result) {
                    if (err) {
                        callback(false);
                        return;
                    }
			        query('delete from "user_group" where group_id = $1::int', [data.eventID],
				        function(err, rows, result) {
					        if (err) {
					        	callback(false);
					        	return;
					        }
					        query('delete from "group" where group_id = $1::int', [data.eventID],
			        			function(err, rows, result) {
			        				if (err) {
			        					callback(false);
			        				}
			        				else {
			        					callback(true);
			        				}
			        		});
		        	});
              });
		}
	};
};
