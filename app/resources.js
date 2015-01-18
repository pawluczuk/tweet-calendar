module.exports = function(app, passport, query) {
	// get list of all 
	app.get('/resources/users', isLoggedIn, function(req, res) {
      	query('select * from "user"', function(err, rows, result) {
      		if (err) return next(err);
      		res.send(rows);
      	});
	});

	// uzytkownicy nalezacy do grupy o danym groupID
	app.get(/\/resources\/groupUsers/, isLoggedIn, function(req, res) {
		groupID = req.query.groupID;
		if (groupID) {
			query('select user_id, email from "user" where user_id in (select user_id from "user_group" where group_id = $1::int)',
				[groupID], function(err, rows, result) {
					console.log(err)
					if (!err)
						res.send(rows);
					else res.send("Invalid query");
				});
		}
		else res.send("Invalid query");
	});

	// eventy ktorych wlascicielem jest uzytkownik o danym userID
	app.get(/\/resources\/eventsOwner/, isLoggedIn, function(req, res) {
		userID = req.user.id;
		if (userID) {
			query('select e.event_id AS id, e.name AS title, e.start_date AS start, e.end_date AS end, et.color from "event" AS e, "event_type" AS et where e.owner_id = $1::int and e.type_code=et.type_code' , [userID],
				function(err, rows, result) {
					if (!err)
						res.send(rows);
					else res.send("Invalid query.");
				});
		}
		else res.send("Invalid query.");
	});

	// eventy na ktore jest zapisany uzytkownik o danym userID
	app.get(/\/resources\/eventsByDate/, isLoggedIn, function(req, res) {
		userID = req.user.id;
		start = req.query.start;
		end = req.query.end;
		if (userID && start && end) {
			query('select * from "event" where event_id in (select event_id from "event_user" where user_id = $1::int) and start_date >= $2::date and end_date =< $3::date',
				[userID, start, end],
				function(err, rows, result) {
					if (!err)
						res.send(rows);
					else res.send("Invalid query.");
				});
		}
		else res.send("Invalid query.");
	});

    // eventy na ktore jest zapisany uzytkownik o danym userIDi danym eventID
    app.get(/\/resources\/eventsByID/, isLoggedIn, function(req, res) {
        userID = req.user.id;
        eventID = req.query.eventID;
        if (userID && eventID) {
            query('select * from "event" where event_id in (' +
				'select event_id from "event_user" where user_id = $1::int' +
				' union ' +
				'select event_id from "event" where owner_id = $1::int' +
				') and event_id=$2::int ',
                [userID, eventID],
                function(err, rows, result) {
                    if (!err)
                        res.send(rows);
                    else res.send("Invalid query.");
                });
        }
        else res.send("Invalid query.");
    });


    // userzy przypisani do eventu o danym id
    app.get(/\/resources\/usersByEventID/, isLoggedIn, function(req, res) {
        eventID = req.query.eventID;
        if (eventID) {
            query('select u.user_id, u.email, u.name, u.surname, e.accepted' +
				' from "user" as u, "event_user" as e' +
				' where u.user_id = e.user_id' +
				' and e.event_id = $1::int',
                [eventID],
                function(err, rows, result) {
                    if (!err)
                        res.send(rows);
                    else res.send("Invalid query.");
                });
        }
        else res.send("Invalid query.");
    });

    // grupy przypisane do eventu o danym id
    app.get(/\/resources\/groupsByEventID/, isLoggedIn, function(req, res) {
        eventID = req.query.eventID;
        if (eventID) {
            query('select group_id, name from "group" where group_id in (select group_id from event_group where event_id = $1::int)',
                [eventID],
                function(err, rows, result) {
                    if (!err)
                        res.send(rows);
                    else res.send("Invalid query.");
                });
        }
        else res.send("Invalid query.");
    });

    // tweety przypisane do eventu o danym id
    app.get(/\/resources\/tweetsByEventID/, isLoggedIn, function(req, res) {
        eventID = req.query.eventID;
        if (eventID) {
            query('select * from "tweet" where event_id = $1::int',
                [eventID],
                function(err, rows, result) {
                    if (!err)
                        res.send(rows);
                    else res.send("Invalid query.");
                });
        }
        else res.send("Invalid query.");
    });

	// grupy ktorych wlascicielem jest uzytkownik o danym userID
	app.get(/\/resources\/groupsOwner/, isLoggedIn, function(req, res) {
		userID = req.user.id;
		if (userID) {
			query('select group_id, name from "group" where owner_id = $1::int', [userID],
				function(err, rows, result) {
					if (!err)
						res.send(rows);
					else res.send("Invalid query.");
				});
		}
		else res.send("Invalid query.");
	});

	// uzytkownicy, ktorzy naleza do danej grupy
	app.get(/\/resources\/userGroups/, isLoggedIn, function(req, res) {
		groupID = req.query.groupID;
		// TODO
	});

	// grupy do ktorych nalezy uzytkownik o danym userID
	app.get(/\/resources\/groups/, isLoggedIn, function(req, res) {
		userID = req.user.id;
		if (userID) {
			query('select group_id from "user_group" where user_id = $1::int', [userID],
				function(err, rows, result) {
					if (!err)
						res.send(rows);
				});
		}
		else res.send("Invalid query.");
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}