var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');

// we'll want to load the database module (knex) to make queries
var knex = require('../db/config').knex;

// statuses: 'rejected', 'null', 'pending', 'accepted'


// GET to /find
router.get('/', function(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientDuoID = tokenObj.currentDuoID;
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;

  // dummy ID: remove this for non-testing.
  var clientDuoID = 1;

  // get all pairs that this client duo is involved in.
  knex('pairs')
    .whereIn('dID1', [clientDuoID])
    .orWhereIn('dID2', [clientDuoID])
    .then(function(resp) {
      // resp is an array of objects, and each object represents a pair.
      // pair looks like: {ID, dID1, dID2, status}

      var pairs = {}; // opponentDuoID : pairObj

      // loop through resp
      resp.forEach(function(pair) {
        // add each pair and its opponent opponentDuoID to pairs obj
        if (pair.dID1 === clientDuoID) {
          pairs[pair.dID1] = pair;
        } else {
          pairs[pair.dID2] = pair;
        }
      });

      console.log(pairs);

      // get all duos that doesn't include the current Duo.
      knex('duos as d')
        .whereNotIn('d.uID1', [clientDuoID])
        .orWhereNotIn('d.uID2', [clientDuoID])
        .join('users as u1', 'd.uID1', '=', 'u1.ID')
        .join('users as u2', 'd.uID2', '=', 'u2.ID')
        .select('d.ID', 'u1.firstname as user1', 'u2.firstname as user2', 'd.imageURL')
        .then(function(resp) {
          // resp is an [] array of objects { dID, fn1, fn2 }

          var results = resp.map(function(duo) {
            if (pairs[duo.ID]) {
              duo.status = pairs[duo.ID].status;
            } else {
              duo.status = null;
            }
            duo.imageURL = duo.imageURL || 'http://www.psdgraphics.com/file/couple-silhouette.jpg';
            return duo;
          });

          res.json({
            results: results
          })
        });
    });
});



// POST to /find
router.post('/', function(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientDuoID = tokenObj.currentDuoID;
  var targetDuoID = req.body.duoID;

  // check whether clientDuoID and targetDuoID exist in database
  knex('pairs')
    .whereIn('dID1', [clientDuoID, targetDuoID])
    .whereIn('dID2', [clientDuoID, targetDuoID])
    .then(function(resp) {
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

module.exports = router;
