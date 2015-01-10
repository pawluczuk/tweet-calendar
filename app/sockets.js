var connectedClients = {};
module.exports = function(io, passport, query) {
	// user connected
	io.on('connection', function(socket) {
		//console.log(findClientsSocket(io));
		// test event
		socket.on('monaEvent', function(data) {
			console.log(data);
			socket.emit('response', { hello: 'Przestan to klikac!' });
		});

		// new group created by user
		socket.on('create-group', function(data) {
			if (data) {
				createGroup(data, query, function(result) {
					if (result)
						socket.emit('group-created', { response : 'true'});
					else
						socket.emit('group-created', { response : 'false'});
				});
			}
		});

		socket.on('create-event', function(data) {
			if (data) {
				createEvent(data, query, function(result) {
					if (result)
						socket.emit('event-created', { response : 'true'});
					else
						socket.emit('event-created', { response : 'false'});
				});
			}
		});
	});
};

// insert into database new group and its members
function createGroup(data, query, callback) {
	if (!data || !data.groupName || !data.ownerID || 
		!data.groupUsers || !data.groupUsers.length) {
		callback(false);
		return;
	}
	var groupName = data.groupName;
	var ownerID = data.ownerID;
	var userIDs = data.groupUsers;
	var result = query('insert into "group" values (DEFAULT, $1::int, $2::text) returning group_id', 
		[ownerID, groupName], 
	    function(err, rows, result) {
	    	if (err) {
	    		callback(false);
	    		return;
	    	}
	    	if (rows && rows[0] && rows[0].group_id) {
	    		var statement = user_group_statement(rows[0].group_id, userIDs);
	    		query(statement, function(err, rows, result) {
	    			if (!err)
	    				callback(true);
	    			else
	    				callback(false);
	    		});
	    	}
	    });
}

function createEvent(data, query, callback) {
	if (!data || !data.eventName || !data.eventType ||
		!data.start || !data.end || !data.additionalUsers || 
		!data.comment || !data.recipient || !data.sender) {
		callback(false);
		return;
	}

	query('insert into "event" values (DEFAULT, $1::int, $2, $3::text, $4::text, $5, $6, now()::timestamp) returning event_id',
		[data.sender, data.eventType, data.eventName, data.comment, data.start, data.end],
		function(err, rows, result) {
			if (err) {
				callback(false);
				return;
			}
			if (!err && rows && rows[0] && rows[0].event_id) {
				var statement = event_user_statement(rows[0].event_id, data.additionalUsers);
				query(statement, function(err, rows, result) {
					if (!err)
						callback(true);
					else
						callback(false);
				});
			}
		});
}

function event_user_statement(event_id, userIDs) {
 	var statement = 'insert into "event_user" values ';
 	for (var i = 0; i < userIDs.length; i++)
 	{
 		statement += '(' + event_id + ',' + userIDs[i] + ')';
 		if (i !== userIDs.length - 1) statement += ', ';
 	}
 	return statement;
}

function user_group_statement(group_id, userIDs) {
	var statement = 'insert into "user_group" values ';
	for (var i = 0; i < userIDs.length; i++)
	{
		statement += '(' + group_id + ',' + userIDs[i] + ')';
		if (i !== userIDs.length - 1) statement += ', ';
	}
	return statement;
}

function findClientsSocket(io, roomId, namespace) {
    var res = [], ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId) ;
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}