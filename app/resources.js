module.exports = function(app, passport, query) {
	// get list of all 
	app.get('/resources/users', isLoggedIn, function(req, res) {
      	query('select * from "user"', function(err, rows, result) {
      		if (err) return next(err);
      		res.send(rows);
      	});
	});

	// eventy ktorych wlascicielem jest uzytkownik o danym userID
	app.get(/\/resources\/eventsOwner/, isLoggedIn, function(req, res) {
		userID = req.query.userID;
		if (req.user.id !== userID) res.send("Access blocked.");
		if (userID) {
			query('select event_id from "event" where owner_id = $1::int', [userID],
				function(err, rows, result) {
					if (!err)
						res.send(rows);
					else res.send("Invalid query.");
				});
		}
	});

	// eventy na ktore jest zapisany uzytkownik o danym userID
	app.get(/\/resources\/events/, isLoggedIn, function(req, res) {
		userID = req.user.id;
		start = req.query.start;
		end = req.query.end;
		if (userID && start && end) {
			query('select * from "event" where event_id in (select event_id from "event_user" where user_id = $1::int) and start_date > $2::date and end_date < $3::date', 
				[userID, start, end],
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
			query('select group_id from "group" where owner_id = $1::int', [userID],
				function(err, rows, result) {
					if (!err)
						res.send(rows);
					else res.send("Invalid query.");
				});
		}
		else res.send("Invalid query.");
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