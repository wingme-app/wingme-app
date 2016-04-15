var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
var hp = require('../modules/helpers');
var pair = require('../modules/pairHelpers');

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

  knex('pairsPending')
    .where('dID1', clientDuoID)
    .andWhere('dID2', targetDuoID)
    .then(function(resp) {
      
    })
    .then(function() {
      if(resp.length === 0) {
        hp.sendJSON(res, false, 'You\'ve already sent a pair request to this duo!');

      } else {

        knex('pairsPending')
          .where('dID1', targetDuoID)
          .andWhere('dID2', clientDuoID)
          .then(function(resp) {
            if (resp.length > 0) {
              if (status === 'accepted') {
                pair.movePairToAccepted(targetDuoID, clientDuoID)
                  .then(function() {
                    hp.sendJSON(res, true, 'You\'ve accepted this duo as a pair!');
                  });
              }
              else if (status === 'rejected') {
                pair.deletePairFromPending(resp[0].ID)
                  .then(function() {
                    hp.sendJSON(res, true, 'You\'ve rejected this duo as a pair!');
                  });
              }

            } else {
              knex('pairsPending')
                .whereIn('dID1', [clientDuoID, targetDuoID])
                .orWhereIn('dID2', [clientDuoID, targetDuoID])
                .then(function(resp) {
                  if(resp.length === 0) {
                    if (status === 'accepted') {
                      pair.insertPairInPP(clientDuoID, targetDuoID)
                        .then(function() {
                          hp.sendJSON(res, true, 'You\'ve sent a pair request to this duo.')
                        });
                    } else {
                      // TODO
                    }
                  }
                });
            }
          })
      }
    })
});


router.get('/myMatches', function(req, res) {

  // var tokenObj = auth.decode(req.headers['x-access-token']);
  // var clientDuoID = tokenObj.currentDuoID;
  // var clientID = tokenObj.ID;
  // var clientUsername = tokenObj.username;
  // var targetDuoID = req.body.targetDuoID

  // dummy ID: remove this for non-testing.
  var clientDuoID = 1;
  // ---

  var result = [];

  findPendingPairsOf(clientDuoID).then(function(resp) {

    resp.forEach(function(duo) {
      duo.status = "pending"
    });
    result = result.concat(resp);

    findAcceptedPairsOf(clientDuoID).then(function(resp) {

      resp.forEach(function(duo) {
        duo.status = "accepted"
      });
      result = result.concat(resp);

      hp.sendJSON(res, true, 'Enjoy your accepted/pending pair list!', result);
    });
  });
});


function findPendingPairsOf(clientDuoID) {

  // query for matches that this duo belongs to
  return knex('pairsPending as p')
    .where('p.dID1', clientDuoID)
    .join('duos as d', 'p.dID2', 'd.ID')
    .where('d.cwStatus', 'accepted')
    .join('users as u1', 'd.uID1', 'u1.ID')
    .join('users as u2', 'd.uID2', 'u2.ID')
    .select('d.ID as duoID', 'u1.ID as u1ID', 'u2.ID as u2ID',
            'u1.firstname as u1Firstname', 'u1.lastname as u1Lastname',
            'u2.firstname as u2Firstname', 'u2.lastname as u2Lastname');
}

function findAcceptedPairsOf(clientDuoID) {

  return knex('pairsAccepted as p')
    .where('p.dID1', clientDuoID)
    .orWhere('p.dID2', clientDuoID)
    .join('duos as d1', 'p.dID1', 'd1.ID')
    .join('duos as d2', 'p.dID2', 'd2.ID')
    .select('p.ID as pairID', 'd1.ID as duoID1', 'd2.ID as duoID2')
    .then(function(resp) {
      // we have a list of accepted pairs and duplicates of clientDuoID

      var allAcceptedDuoIDs = resp.map(function(pair){
        if (pair.duoID1 !== clientDuoID) {
          return pair.duoID1;
        } else {
          return pair.duoID2;
        }
      });

      return knex('duos as d')
        .whereIn('d.ID', allAcceptedDuoIDs)
        .join('users as u1', 'd.uID1', 'u1.ID')
        .join('users as u2', 'd.uID2', 'u2.ID')
        .select('d.ID as duoID', 'u1.ID as u1ID', 'u2.ID as u2ID',
                'u1.firstname as u1Firstname', 'u1.lastname as u1Lastname',
                'u2.firstname as u2Firstname', 'u2.lastname as u2Lastname');
    });
}

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
