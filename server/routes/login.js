var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');

// we'll want to load the database module (knex) to make queries
var knex = require('../db');

/**
 *  router/login.js
 *
 *  API endpoint: /api/login
 */
router.post('/', function(req, res) {
  var user = req.body;

  // data validation
  if (!validate(user)) {
    res.json({
      success: false,
      message: 'Please provide a username and password.'
    });
    
  // if data validation passes
  } else {
    knex('users').where({username: user.username})
      .then(function(resp) {
        var userFromDb = resp[0];

        if (userFromDb && userFromDb.password === user.password) {
          res.json({
            success: true,
            message: 'Logged in!',
            token: auth.genToken(userFromDb)
          });
        } else {
          res.json({
            success: false,
            message: 'Username or password is incorrect.'
          });
        }
      });
  }
});

// helper functions
function validate(user) {
  return user.username && user.password;
}

// export router
module.exports = router;
