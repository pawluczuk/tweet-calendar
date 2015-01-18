// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt          = require('bcrypt-nodejs');

// expose this function to our app using module.exports
module.exports = function(passport, query) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        query('select * from "user" where user_id = $1::int', [id], function(err, rows, result) {
            if (rows.length) done(err, passportUser(rows[0]));
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        query('select * from "user" where email = $1::text', [email], function(err, rows, result) {
            if (err)
                return done(err);
            if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'Adres e-mail jest już w użyciu.'));
            }
            else {
                // insert new user
                var newUser = {};
                newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
                newUser.email = req.body.email;
                newUser.name = req.body.name;
                newUser.surname = req.body.surname;

                query('insert into "user" values (DEFAULT, $1::text, $2::text, $3::text, $4::text) returning user_id', 
                    [newUser.password, newUser.email, newUser.name, newUser.surname], 
                    function(err, rows, result) {
                        if (rows[0])
                        {
                            newUser.user_id = rows[0].user_id;
                            return done(null, passportUser(newUser));
                        }
                    });
            }
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        query('select * from "user" where email = $1::text', [email], function(err, rows, result) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!rows.length)
                return done(null, false, req.flash('loginMessage', 'Nie ma takiego użytkownika.'));

            // user is found
            var user = rows[0];
            if (!bcrypt.compareSync(password, user.password))
                return done(null, false, req.flash('loginMessage', 'Niepoprawne hasło.'));

            // all is well, return successful user
            return done(null, passportUser(user));
        });
    }));

};

function passportUser(user) {
    var obj = {};
    obj.id = (user.user_id) ? user.user_id : '';
    obj.username = (user.email) ? user.email : '';
    obj.password = (user.password) ? user.password : '';
    return obj;
}