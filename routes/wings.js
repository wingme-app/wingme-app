var express = require('express');
var router = express.Router();
// var auth = require('../modules/auth');
// we'll want to load the database module (knex) to make queries
var knex = require('../db/config.js').knex;
/**
 *  router/wings.js
 *
 *  API endpint: /api/wings
 */

var wingid;
router.post('/add', function(req, res) {
  // var tokenObj = auth.decode(req.headers['x-access-token']);
  // var clientID = tokenObj.ID;
  // var clientUsername = tokenObj.username;

  knex('users')
   .where('username', req.body.wingToAdd)
      .select('ID')
   .then(function(ID) {
      wingid = ID;
     return wingid.forEach(function(currentId){
        if(!currentId){
          res.send({
            success: false,
            message: 'User does not exist; no wing added.'
          })
        }
      });
   })
   .then(function() {
      knex('duos')
        .where('uID1', req.body.clientID)  
        .andWhere('uID2', wingid[0].ID)
        .select('ID')
        .select('status')
        .then(function(status){
          return status.forEach(function(currentEl){
             if(currentEl.status === 'pending'){ 
              knex('duos')
               .where({ ID : currentEl.ID })
               .update({
                  status: 'accepted'
                })
               .then(function(){
                  res.send({
                    success: true,
                    message: 'Your wing is added!'
                  })  
                })
              }
              else if(currentEl.status === 'accepted'){
                knex('duos')
                .where({ ID : currentEl.ID })
                .update({
                  status: 'accepted'
                })
                .then(function(){
                  res.send({
                    success: false,
                    message: 'You are already wings!'
                  })
                })
              }
              else if(currentEl.status === 'null') {
                //use knex query to update status
                knex('duos')
                .where({ ID : currentEl.ID })
                .update({
                  status: 'pending'
                })
                .then(function() {
                    res.send({
                     success: true,
                     message: 'Status is now pending!'
                    })
                })
              }
          });
        })
   })
    .catch(function(err) {
     console.log('Error is', err);
   })
 })

// Get request route
router.get('/requests', function(req, res) {
  // where({ uID1: 1 }) is going to be a token
  knex('duos as d').where({ uID1: 1 })
   .join('users as u', 'd.uID2', '=', 'u.ID')
   .select('u.ID', 'u.firstname', 'u.lastname', 'd.status')
   .then(function(result) {
    result.forEach(function(currentEl) {
      if (currentEl.status === 'pending') {
        console.log('currentEl pending status is', currentEl.status);
        currentEl.status = false;
      }
      else if (currentEl.status === 'accepted') {
        console.log('currentEl accept status is', currentEl.status);
        currentEl.status = true;
      }
    })
    res.send({results: result});
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
  /* expected output: array of objects that look like:
    {
      duoID that includes the potential wing
      uID of potential wing
      firstname of potential wing
      lastname of potential wing
    }
  */
});

router.post('/current', function(req, res) {
  /* we are expecting req.body to contain an obj:
    {
      client gives duoID in question where uID1: clientID, 
      targetuID in question
      client is sending status: accepted/rejected this target request
    }
  */

  knex('duos')
    .where('ID', duoID)
    .select('cwStatus')
    .then(function(status) {
      if (status === 'pending') {
        if (req.status === 'accepted') {
          knex('duos')
            .where('uID1', targetuID)
            .andWhere('uID2', clientID)
            .then(function(duoID) {

            })
            .where('uID2', clientID)
            .orWhere('uID2', targetuID)
        }
      }
    })
  // if a row for uID1=clientID & uID2=targetuID has a currentWing status of pending,
  // that means that the targetuID already sent a currentWing request to clientID
    
    // if req.status = accepted

      // find all duo rows for uID2 = clientID || targetuID EXCEPT for the duoIDs being targeted
      // set the status to null

    // if req.status = rejected

      // find both duo rows 
      // (where uID1 = clientID & uID2 = targetuID) &
      // (where uID1 = targetuID & uID2 = clientID)
      // set the status to null

  // else (if a row for uID1=clientID & uID2=targetuID has a currentWing status of null)

    // we can expect the req.status to only be accepted in this scenario.
    // find row where ID = duoID (given inside of req.body)
    // set cwStatus to active

    // find row where uID1 = targetuID & uID2 = clientID
    // set cwStatus to pending
})

  /**
   *  You'll notice that we use res.json({}) to send responses to our client
   *  regardless of whether the operation succeeded or not. This is because
   *  error codes are not as helpful, but a json object with a description
   *  of what occured 
   *
   */
// export router
module.exports = router;