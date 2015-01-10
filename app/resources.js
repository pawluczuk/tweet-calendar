module.exports = function(app, passport, query) {
	// get list of all 
	app.get('/resources/users', isLoggedIn, function(req, res) {
      	query('select * from "user"', function(err, rows, result) {
      		if (err) return next(err);
      		res.send(rows);
      	});
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