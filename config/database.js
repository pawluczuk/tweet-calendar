var configDB = require('./config/database.js');
var pg 		 = require('pg');

// configuration ===============================================================
pg.connect(configDB, function(err, client, done) {
  if(err) {
    return console.error('Could not connect to database.', err);
  }
});

module.exports = {
   query: function(text, values, cb) {
      pg.connect(function(err, client, done) {
        client.query(text, values, function(err, result) {
          done();
          cb(err, result);
        })
      });
   }
}