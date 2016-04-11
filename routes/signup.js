var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');

// we'll want to load the database module (knex) to make queries
var knex = require('../db');


/**
 *  router/signup.js
 *
 *  API endpint: /api/signup
 */
router.post('/', function(req, res) {
  var user = req.body;
  console.log(req.body);

  /**
   *  You'll notice that we use res.json({}) to send responses to our client
   *  regardless of whether the operation succeeded or not. This is because
   *  error codes are not as helpful, but a json object with a description
   *  of what occured 
   *
   */

  // data validation
  if (!validate(user)) {
    res.json({
      success: false,
      message: 'User information validation failed.'
    });

  // if data validation passes, insert user object into database
  } else {
    knex('users').insert(user)
      .then(function(ID) {
        user.ID = ID[0];

        res.json({
          success: true,
          message: 'User inserted into database. Enjoy your token!',
          token: auth.genToken(user)
        });
      }, function(err) {
        var message = err.code;
        
        if (err.errno === 19) {
          message = 'username already exists!'
        }
        res.json({
          success: false,
          message: message
        });
      });
  }
});

// helper functions
function validate(user) {
  console.log(user);
  return user.username && user.firstname && user.lastname && user.email && user.password;
}

// export router
module.exports = router;
