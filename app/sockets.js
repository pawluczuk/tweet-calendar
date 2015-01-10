
module.exports = function(io, passport, query) {

	var newEvent = require('./socket-events/create-event.js')(io, query);
	var newGroup = require('./socket-events/create-group.js')(io, query);
	// user connected
	io.on('connection', function(socket) {
		//console.log(findClientsSocket(io));

		// new group created by user
		socket.on('create-group', function(data) {
			if (data) {
				newGroup.createGroup(data, function(result) {
					if (result)
						socket.emit('group-created', { response : 'true'});
					else
						socket.emit('group-created', { response : 'false'});
				});
			}
		});

		// new event created by user
		socket.on('create-event', function(data) {
			if (data) {
				newEvent.createEvent(data, function(result) {
					if (result)
						socket.emit('event-created', { response : 'true'});
					else
						socket.emit('event-created', { response : 'false'});
				});
			}
		});

		// test event
		socket.on('monaEvent', function(data) {
			console.log(data);
			socket.emit('response', { hello: 'Przestan to klikac!' });
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