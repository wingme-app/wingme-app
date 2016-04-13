var express = require('express');
var router = express.Router();
// var auth = require('../modules/auth');
// we'll want to load the database module (knex) to make queries
var knex = require('../db/config').knex;
var auth = require('../modules/auth');

// router.post('/hello', function(req, res) {
//   console.log("hiii", req.body);
//   res.send("hi");
// });

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

  // testing:
  // var clientID = req.headers.clientid;
  // var wingToAdd = req.body.wingToAdd;

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

          // if clientToWing entry already exists
          if (clientToWing) {
            if (clientToWing.status === 'pending') {
              sendJSON(res, false, 'You already have a pending request to ' + wingToAdd + '!');
            } else if (clientToWing.status === 'accepted') {
              sendJSON(res, false, 'You are already wings with ' + wingToAdd + '!');
            }

          // if wingToClient already exists
          } else if (!clientToWing && wingToClient) {
            // insert a new row representing client to wing
            // then set status of both to 'accepted'
            makeNewDuoEntry(clientID, wingToAddID, 'accepted')
              .then(function() {
                return acceptDuoEntries(clientID, wingToAddID);
              })
              .then(function() {
                sendJSON(res, true, 'You and ' + wingToAdd + ' are now wings!');
              });
          
          // if neither wingToClient or clientToWing relationships exist
          } else {
            // set status of new entry to 'pending'
            makeNewDuoEntry(clientID, wingToAddID, 'pending')
              .then(function() {
                sendJSON(res, true, 'You have sent a wing request to ' + wingToAdd + '.');

                // debugging
                knex('duos').then(function(resp) {
                  console.log(resp);
                })
              });
          }

        }); // end then() -----
    }); // end then() -----
});

router.get('/wingRequests', function(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;

  // testing
  // var clientID = req.headers.clientid;

  knex('duos as d')
    .where('uID2', clientID)
    .join('users as u', 'd.uID1', '=', 'u.ID')
    .select('u.ID', 'u.firstname', 'u.lastname', 'd.status', 'd.cwStatus')
    .then(function(resp) {

      var results = resp.map(function(wing) {
        // keep it a pure function
        wing = Object.assign({}, wing);

        // convert status to isWing boolean
        wing.isWing = (wing.status === 'accepted') ? true : false;
        delete wing.status;

        // convert cwStatus to isCurrentWing boolean
        wing.isCurrentWing = (wing.cwStatus === 'accepted') ? true : false;
        delete wing.cwStatus;

        return wing;
      });

      sendJSON(res, true, 'enjoy your wing requests!', results);
    });
});

router.post('/wingRequests', function(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;

  // testing
  // var clientID = req.headers.clientid;
  // var targetID = req.body.targetuID;

  knex('duos')
    .whereIn('uID1', [clientID, targetID])
    .whereIn('uID2', [clientID, targetID])
    .whereNot('status', 'accepted')
    .update({ status: 'accepted' })
    .then(function() {
      sendJSON(res, true, 'wing request accepted!')
    });

})

// request for any accepted duo partners that have a pending.
router.get('/current', function(req, res) {
  // var tokenObj = auth.decode(req.headers['x-access-token']);
  // var clientID = tokenObj.ID;
  // var clientUsername = tokenObj.username;

  // testing
  var clientID = req.headers.clientid;

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

router.post('/current', function(req, res) {
  /* we are expecting req.body to contain an obj:
    {
      duoID in question
      targetuID in question
      status of post: accepted/rejected
    }
  */

  // if a row for uID1=clientID & uID2=targetuID has a currentWing status of pending,
  // that means that the targetuID already sent a currentWing request to clientID
    
    // if status = accepted

      // find all duo rows for uID2 = clientID || targetuID EXCEPT for the duoIDs being targeted
      // set the status to null

    // if status = rejected

      // find both duo rows 
      // (where uID1 = clientID & uID2 = targetuID) &
      // (where uID1 = targetuID & uID2 = clientID)
      // set the status to null

  // else (if a row for uID1=clientID & uID2=targetuID has a currentWing status of null)

    // if status = accepted





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

function makeNewDuoEntry(user1, user2, status) {
  return knex('duos').insert({
    uID1: user1,
    uID2: user2,
    status: status
  });
}

function acceptDuoEntries(user1, user2) {
  return knex('duos')
    .whereIn('uID1', [user1, user2])
    .whereIn('uID2', [user1, user2])
    .update({ status: 'accepted' });
}




// export router
module.exports = router;
