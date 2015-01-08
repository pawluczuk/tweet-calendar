// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt   = require('bcrypt-nodejs');

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
        // ODKOMENTOWAC
        /*
        query('select * from "user" where user_id = $1::int', [id], function(err, rows, result) {
            done(err, rows[0]);
        });
        */
        var testUsr = {
                id : 1,
                username : 'monka@monka.pl',
                password : 'monanana'
        };
        done(null, testUsr);
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
            if (rows) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            }
            else {
                // insert new user
                var newUser = {};
                newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
                newUser.email = req.body.email;
                newUser.name = req.body.name;
                newUser.surname = req.body.surname;

                query('insert into "user" values (DEFAULT, $1::text, $2::text, $3::text, $4::text)', 
                    [newUser.password, newUser.email, newUser.name, newUser.surname], 
                    function(err, rows, result) {
                        return done(null, newUser);
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

        // ODKOMENTOWAC
        /*
        query('select * from "user" where email = $1::text', [email], function(err, rows, result) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!rows)
                return done(null, false, req.flash('loginMessage', 'Nie ma takiego użytkownika.')); // req.flash is the way to set flashdata using connect-flash

            // user is found
            var dbPassword = rows[0].password;
            if (!bcrypt.compareSync(password, dbPassword))
                return done(null, false, req.flash('loginMessage', 'Niepoprawne hasło.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, rows[0]);
        });
        */

        // baza nie dziala - logowanie zawsze dzialajace
        var testUsr = {
                id : 1,
                username : 'monka@monka.pl',
                password : 'monanana'
        };
        return done(null, testUsr);
    }));

};
