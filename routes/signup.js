var express = require('express');
var router = express.Router();

// we'll want to load the database module (knex) to make queries
var knex = require('../db');

/**
 *  router/signup.js
 *
 *  API endpint: /api/signup
 */
router.post('/', function(req, res) {
  var user = req.body;

  /**
   *  You'll notice that we use res.json({}) to send responses to our client,
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
      .then(function() {
        res.json({
          success: true,
          message: 'User inserted into database'
        });
      }, function(err) {
        console.error(err);
        res.json({
          success: false,
          message: err
        });
      });
  }
});

// helper functions
function validate(user) {
  return user.username && user.firstname && user.lastname && user.email && user.password;
}

// export router
module.exports = router;
