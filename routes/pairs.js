var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');

// we'll want to load the database module (knex) to make queries
var knex = require('../db/config').knex;

// statuses: 'rejected', 'null', 'pending', 'accepted'

// API endpoint: /api/pairs/

// GET to /find
router.get('/find', function(req, res) {
  // var tokenObj = auth.decode(req.headers['x-access-token']);
  // var clientDuoID = tokenObj.currentDuoID;
  // var clientID = tokenObj.ID;
  // var clientUsername = tokenObj.username;

  // dummy ID: remove this for non-testing.
  var clientDuoID = 4;

  // get all duos that have a pending status going TO client (client is in dID2 column)
  knex('pairs')
    .where('dID2', clientDuoID)
    .where('status', 'pending')
    .then(function(resp) {
      // resp is an array of objects, and each object represents a pair.
      // a pair looks like: {ID, dID1, dID2, status}

      // we'll store what we find in a pairs object, to use in our sorting logic in the next query.
      var pairs = {}; // opponentDuoID : pairObj

      resp.forEach(function(pair) {
        pairs[pair.dID1] = true;
      });

      console.log(pairs);

      // get all duos that doesn't include the current Duo.
      knex('duos as d')
        .whereNot('d.uID1', clientDuoID)
        .orWhereNot('d.uID2', clientDuoID)
        .join('users as u1', 'd.uID1', '=', 'u1.ID')
        .join('users as u2', 'd.uID2', '=', 'u2.ID')
        .select('d.ID', 'u1.firstname as user1', 'u2.firstname as user2', 'd.imageURL')
        .then(function(resp) {
          // resp is an [] array of objects { dID, fn1, fn2 }

          var results = resp.map(function(duo, index) {
            return { index: index, value: duo }
          });

          results.sort(function(a, b) {
            if (a.value.ID in pairs && b.value.ID in pairs) {
              return a.index - b.index;
            } else if (a.value.ID in pairs) {
              return -1;
            } else {
              return 1;
            }
          })

          results = results.map(function(obj) {
            return obj.value;
          });

          sendJSON(res, true, 'Here is your super curated potential duos list!', results);
        });
    });
});

// POST to /find
router.post('/find', function(req, res) {
  // var tokenObj = auth.decode(req.headers['x-access-token']);
  // var targetDuoID = req.body.duoID;

  // testing
  var clientDuoID = req.body.clientDuoID
  var targetDuoID = req.body.targetDuoID;

  // 

});

// POST to /find
router.post('/find', function(req, res) {
  // var tokenObj = auth.decode(req.headers['x-access-token']);
  // var clientDuoID = tokenObj.currentDuoID;
  // var targetDuoID = req.body.duoID;

  // testing
  var clientDuoID = 4;
  var targetDuoID = 1;

  // check whether clientDuoID and targetDuoID exist in database
  knex('pairs')
    .whereIn('dID1', [clientDuoID, targetDuoID])
    .whereIn('dID2', [clientDuoID, targetDuoID])
    .then(function(resp) {
      console.log(resp);
      // update status
      if (resp.length) {
        knex('pairs')
          .where({ID: resp[0].ID})
          .update({status: 'accepted'})
          .then(function(resp) {
            res.json({
              success: true,
              message: 'The pair status was changed from pending to accepted.'
            });
          }, function(err) {
            res.json({
              success: false,
              message: err
            });
          })

      // otherwise insert with 'pending' status
      } else {
        knex('pairs')
          .insert({
            dID1: clientDuoID,
            dID2: targetDuoID,
            status: 'pending'
          })
          .then(function(resp) {
            res.json({
              success: true,
              message: 'The pair status was changed from pending to accepted.'
            });
          }, function(err) {
            res.json({
              success: false,
              message: err
            });
          })
      }
    })

});


function sendJSON(res, success, message, results) {
  var response = {
    success: success,
    message: message
  }

  if (results) {
    response.results = results;
  }

  res.json(response);
}

module.exports = router;
