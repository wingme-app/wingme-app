var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
var hp = require('../modules/helpers');

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

  var clientID = 1;

  knex('pairsPending')
    .where('dID2', clientDuoID)
    .select('dID1')
    .then(function(resp) {
      // resp contains all duo IDs
      var IDs = resp.map(function(duo) {
        return duo.dID1;
      });
      // [1, 3, 6, 9]

      knex('duos as d')
        .whereIn('ID', IDs)
        .join('users as u1', 'duos.uID1', 'u1.ID')
        .join('users as u2', 'duos.uID2', 'u2.ID')
        .select('duos.ID as duoID', 'u1.firstname as u1Firstname', 'u1.lastname as u1Lastname', 'u2.firstname as u2Firstname', 'u2.lastname as u2Lastname')

        .then(function(resp) {
          resp.forEach(function(duo) {
            duo.status = "pending"
          });
          return resp;
        })

        .then(function(pendingDuos) {
          knex('duos')
            .where(function() {
              this.whereNot('uID1', clientID).orWhereNot('uID2', clientID)
            })
            .where('cwStatus', 'active')
            .join('users as u1', 'duos.uID1', '=', 'u1.ID')
            .join('users as u2', 'duos.uID2', '=', 'u2.ID')
            .select('duos.ID as duoID', 'u1.firstname as u1Firstname', 'u1.lastname as u1Lastname', 'u2.firstname as u2Firstname', 'u2.lastname as u2Lastname')

            .then(function(resp) {
              resp.forEach(function(duo) {
                duo.status = null;
              });

              res.json({
                success: true,
                message: 'Here are a list of potential pairs you can pick from!',
                results: resp.concat(pendingDuos)
              });
            });
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
  var status = req.body.status; // accepted or rejected

  // if C->T exists inside of pairsPending
  
    // error: you've already sent a pair request to this duo!

  // does T->C exist inside of pairsPending? if so:

    // if status = accepted
      // move T->C to pairs pairsAccepted table

    // otherwise
      // remove T-> entry from pairsPending

  // if neither exists inside of pairsPending

    // if status = accepted
      // put C->T inside of pairsPending

    // otherwise
      // do nothing

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
