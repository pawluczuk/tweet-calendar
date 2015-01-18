module.exports = function(io, query) {
	return {
		tweet : function(data, callback) {
			if (invalid(data)) {
				callback(false);
				return;
			}
			query('delete from "tweet" where tweet_id = $1::int', 
				[data.tweetID], function(err, rows, result) {
					if (err) {
						callback(false);
						return;
					}
					else callback(true);
			});
		}
	};
};

function invalid(data) {
	return !data || !data.tweetID;
}