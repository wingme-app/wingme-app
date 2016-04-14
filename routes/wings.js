var express = require('express');
var router = express.Router();
// var auth = require('../modules/auth');
// we'll want to load the database module (knex) to make queries
var knex = require('../db/config').knex;
var auth = require('../modules/auth');
var _ = require('underscore');

/**
 *  router/wings.js
 *
 *  API endpint: /api/wings
 */

router.post('/add', function(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;
  var wingToAdd = req.body.wingToAdd;

  // testing
  // var clientID = req.headers.clientid;

  // does wingToAdd even exist?
  knex.select('ID')
    .from('users')
    .where('username', wingToAdd)
    .then(function(resp) {

      if (!resp.length) {
        sendJSON(res, false, 'Username does not exist!');
      } else if (resp.length > 1) {
        sendJSON(res, false, 'Duplicate usernames in DB');
      } else {
        // pass the ID of the wingToAdd username for convenience in our next .then()
        return resp[0].ID;
      }
    }) // end then() -----

    .then(function(wingToAddID) {

      // does client & wingToAdd already exist?
      knex('duos')
        .whereIn('uID1', [clientID, wingToAddID])
        .whereIn('uID2', [clientID, wingToAddID])
        .then(function(resp) {

          var clientToWing = resp.filter(function(duo){
            return duo.uID1 == clientID;
          })[0];
          var wingToClient = resp.filter(function(duo){
            return duo.uID1 == wingToAddID;
          })[0];

          if (clientToWing && wingToClient) {

            if (clientToWing.status === 'accepted' && wingToClient.status === 'pending') {
              sendJSON(res, false, 'you already have a pending request to ' + wingToAdd);
            } else if (clientToWing.status === 'accepted' && wingToClient.status === 'accepted') {
              sendJSON(res, false, 'already wings bruh!');
            } else if (wingToClient.status === 'accepted' && clientToWing.status === 'pending') {
              knex('duos')
                .where('ID', clientToWing.ID)
                .update({ status : 'accepted' })
                .then(function() {
                  sendJSON(res, true, 'You are now winged up with ' + wingToAdd);
                });
            }

          } else {
            makeNewDuoEntry(clientID, wingToAddID)
              .then(function() {
                sendJSON(res, true, 'You have sent a request to ' + wingToAdd);
              });            
          }

        }); // end then() -----
    }); // end then() -----
});

router.get('/wingRequests', function(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;

  // // testing
  // var clientID = req.headers.clientid;

  knex('duos')
    .where('uID1', clientID)
    .orWhere('uID2', clientID)
    .then(function(resp) {

      // resp contains all duos that clientID is involved in

      // storage object
      var storage = {};

      // loop through resp
      _.each(resp, function(duo) {
        var targetID = (duo.uID1 === clientID) ? duo.uID2 : duo.uID1;
        var relationship = (duo.uID1 === clientID) ? 'CT' : 'TC';

        var entry = storage[targetID] || {};
        storage[targetID] = entry;
        entry[relationship] = [duo.status, duo.cwStatus];
      }); 

      knex('users')
        .whereIn('ID', Object.keys(storage))
        .select('ID', 'firstname', 'lastname')
        .then(function(resp) {

          // map resp
          var results = resp.map(function(user) {
            var ID = user.ID;
            var userObj = storage[ID];

            user.isCurrentWing = (userObj.CT[1] === "accepted" && userObj.TC[1] === "accepted");
            user.pendingCurrentWing = (userObj.CT[1] === "accepted" && userObj.TC[1] === "pending");
            user.isWing = (userObj.CT[0] === "accepted" && userObj.TC[0] === "accepted");
            user.pendingWing = (userObj.CT[0] === "accepted" && userObj.TC[0] === "pending");

            return user;
          });

          sendJSON(res, true, 'enjoy your users!', results);
        });
    });
});

router.post('/wingRequests', function(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;

  // testing
  // var clientID = req.headers.clientid;

  var targetID = req.body.targetID;
  var submittedStatus = req.body.accepted;

  knex('duos')
    .whereIn('uID1', [clientID, targetID])
    .whereIn('uID2', [targetID, clientID])
    .then(function(resp) {

      var clientToTarget = resp.filter(function(duo) {
        return duo.uID1 === clientID;
      })[0];
      var targetToClient = resp.filter(function(duo) {
        return duo.uID2 === clientID;
      })[0];

      if (submittedStatus) {

        if (clientToTarget.status === 'accepted' && targetToClient.status === 'accepted') {
          sendJSON(res, false, 'you are already wings with them!');
        } else {
          knex('duos')
            .where('ID', clientToTarget.ID)
            .update({ status: 'accepted' })
            .then(function() {
              sendJSON(res, true, 'you have accepted their wing request! :)');
            });
        }

      } else {
        knex('duos')
          .whereIn('ID', [clientToTarget.ID, targetToClient.ID])
          .update({ status: 'rejected' })
          .then(function() {
            sendJSON(res, false, 'you have rejected their wing request. :(');
          })
      }
    });

})

// request for any accepted duo partners that have a pending.
router.get('/current', function(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;

  // testing
  // var clientID = req.headers.clientid;

  // find any rows where uID1 == clientID and the cwStatus == pending
  knex('duos as d')
    .where('uID1', clientID)
    .andWhere('cwStatus', 'pending')
    .join('users as u', 'd.uID2', '=', 'u.ID')
    .select('d.ID', 'u.ID', 'u.firstname', 'u.lastname')
    .then(function(resp) {
      sendJSON(res, true, 'Here are the list of potential users that have been added.', resp);
    });
});

// request for any accepted duo partners that have a pending.
router.get('/current', function(req, res) {
  // find any rows where uID1 == clientID and the cwStatus == pending
  knex('duos as d')
    .where('uID1', clientID)
    .andWhere('cwStatus', 'pending')
    .join('users as u', 'd.uID2', '=', 'u.ID')
    .select('d.ID', 'u.ID', 'u.firstname', 'u.lastname')
    .then(function(resp) {
      res.json({
        success: true,
        message: 'Here are the list of potential users that have been added',
        results: resp
      });
    });
});

router.post('/current', function(req, res) {
  var duoID2;
  knex('duos') // set duoID2 to the target's duo ID
    .where('ID', req.body.duoID)
    .select('cwStatus')
    .then(function(status) { 
      knex('duos')
        .where('uID1', req.body.targetuID)
        .andWhere('uID2', req.body.clientID)
        .select('ID')
        .then(function(id) {
          if (id.length > 0) {
            duoID2 = id[0].ID;
            return duoID2;
          }
        })

      if (status[0].cwStatus === 'pending') { // clientDuoID's cwStatus
        if (req.body.status === 'accepted') {
        knex('duos')
          .whereNot('uID1', req.body.clientID)
          .andWhereNot('uID1', req.body.targetuID)
          .orWhereNot('uID2', req.body.clientID)
          .andWhereNot('uID2', req.body.targetuID)
          .select('ID')
          .then(function(idarray){
            return idarray.forEach(function(currentEl){
              if(currentEl.ID !==req.body.duoID || currentEl.ID !==duoID2){
                knex('duos')
                  .where({ ID: currentEl.ID})
                  .update( {cwStatus: 'null'} )
                  .then(function(){
                    res.send({
                      message:'All other wing requests have their cwStatus set to null.'
                    })
                  })
              }
            })
          })
      } else if (req.body.status === 'rejected') {
        knex('duos')
          .where(function() {
            this.where('ID', req.body.duoID)
            .orWhere('ID', duoID2)
          })
          .select('ID')
          .update({ cwStatus: 'null' })
          .then(function() {
            res.send({
              message: 'You have rejected this wing request.'
            });
          }) 
      } 
    } 
      else if (status[0].cwStatus === 'null') {
        if (req.body.status==='accepted') {
          console.log("inside else if null, req.body accepted");
          knex('duos')
            .where('ID',req.body.duoID)
            .select('ID')
            .update({ cwStatus : 'active' })
            .then(function(){
              console.log('Client Duo ID has been updated to active.')
            })

          knex('duos')
            .where(function() {
              this.where('uID1', req.body.targetuID).andWhere('uID2', req.body.clientID)
            })
            .select('ID')
            .update({ cwStatus : 'pending' }) 
            .then(function() {
                res.send({
                  message: 'Client Duo ID updated to active. Target Duo ID status updated to pending.'
                });
            })
        }
      }
    })     
})


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

function makeNewDuoEntry(user1, user2) {
  return knex('duos').insert([{
    uID1: user1,
    uID2: user2,
    status: 'accepted',
  }, {
    uID1: user2,
    uID2: user1,
    status: 'pending'
  }]);
}

function acceptDuoEntries(user1, user2) {
  return knex('duos')
    .whereIn('uID1', [user1, user2])
    .whereIn('uID2', [user1, user2])
    .update({ status: 'accepted' });
}

// export router
module.exports = router;
