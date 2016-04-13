var express = require('express');
var router = express.Router();
// var auth = require('../modules/auth');
// we'll want to load the database module (knex) to make queries
var knex = require('../db/config').knex;
var auth = require('../modules/auth');

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
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;

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
  /* we are expecting req.body to contain an obj:
    {
      client gives duoID in question where  uID1: clientID, 
      targetuID in question
      client is sending status: accepted/rejected this target request
    }
  */
  var duoID2;
  knex('duos')
    .where('ID', req.body.duoID)
    .select('cwStatus')
    .then(function(status) {
      console.log('line 153 duoID',req.body.duoID);
      console.log('status is', status);
      console.log('line 154 cwStatus[0]',status[0].cwStatus);
        knex('duos')
          .where('uID1', req.body.targetuID)
          .andWhere('uID2', req.body.clientID)
          .select('ID')
          .then(function(id) {
            //if id exists
            console.log('line 167 ID of  target and client',id)
            if (id.length > 0) {
            duoID2 = id[0].ID;
            console.log(id[0].ID);
            return duoID2;
            }
          })
  // if a row for uID1=clientID & uID2=targetuID has a currentWing status of pending,
  // that means that the targetuID already sent a currentWing request to clientID
      if (status[0].cwStatus === 'pending') {
      // if req.status = accepted
        if (req.body.status === 'accepted') {
        // find all duo rows for uID2 = clientID || targetuID EXCEPT for the duoIDs being targeted

          knex('duos')
            .whereNot('uID1', req.body.clientID)
            .andWhereNot('uID1', req.body.targetuID)
            .orWhereNot('uID2', req.body.clientID)
            .andWhereNot('uID2', req.body.targetuID)
            .select('ID')
            .then(function(idarray){
              console.log('line 192 idarray',idarray);
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
        }

      } else if (req.body.status === 'rejected') {
      // find both duo rows 
      // (where uID1 = clientID & uID2 = targetuID) &
      // (where uID1 = targetuID & uID2 = clientID)

        knex('duos')
          
            .where('ID', req.body.duoID)
            .andWhere('ID', duoID2)

            // .orWhere('ID', req.body.duoID)
            // .andWhere('ID', req.body.duoID2)
            .select('ID')
          // .where('ID',req.body.duoID)
          // .orWhere('ID', duoID2)
          // .select('ID')
          //.update({ cwStatus: 'null' })
          .then(function(resp) {
            console.log('line 209 resp',resp)
            console.log('req.body.duoID',req.body.duoID)
            console.log('line 210 duoid2',duoID2)
            res.send({
              message: 'You have rejected this wing request.'
            });
          })
      // else (if a row for uID1=clientID & uID2=targetuID has a currentWing status of null)
      } 
      }
      
      else if (status[0].cwStatus === 'null') {
           //if req.status = rejected

        // we can expect the req.status to only be accepted in this scenario.
        // find row where ID = duoID (given inside of req.body)
        // set cwStatus to active
        knex('duos')
         .where('ID',req.body.duoID)
         .update({ cwStatus : 'active' })
         .then(function(){
           console.log('Client Duo ID status updated to active.')
         });

         knex('duos')
           .where('uID1', req.body.targetUID)
           .andWhere('uID2', req.body.clientID)
           .update({ cwStatus : 'pending' }) 
           .then(function() {
             console.log('Target Duo ID status updated to pending.')
           });
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
