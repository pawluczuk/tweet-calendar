module.exports = function(io, query) {
	return {
		createGroup : function(ownerID, data, callback) {
			if (!ownerID || invalid(data)) {
				callback(false);
				return;
			}
			var groupName = data.groupName;
			var result = query('insert into "group" values (DEFAULT, $1::int, $2::text) returning group_id', 
				[ownerID, groupName], 
			    function(err, rows, result) {
			    	if (err)
			    		callback(false);
			    	else 
			    		callback(true);
			    });
		}
	};
};

function invalid(data) {
	return !data || !data.groupName;
}