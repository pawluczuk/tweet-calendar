// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var path     = require('path');
var app      = express();
var http 	 = require('http').Server(app);
var io	 	 = require('socket.io')(http); 
var port     = process.env.PORT || 80;
var passport = require('passport');
var flash    = require('connect-flash');


// db configuration =============================================================
var configDB = require('./config/database-config.js');
var query 	 = require('pg-query');
query.connectionParameters = configDB;
require('./config/passport')(passport, query); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	// set template engine
	app.set('view engine', 'jade');

	// add public folder
	app.use(express.static(path.join(__dirname, 'public')));

	// required for passport
	app.use(express.session({ secret: 'sessionsecret' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// print error
app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

// launch http server ==========================================================
http.listen(port);
console.log('App runs on port: ' + port);

// launch socket.io
require('./app/sockets.js')(io);
