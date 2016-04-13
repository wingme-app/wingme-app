var express = require('express');
var router = express.Router();
// var auth = require('../modules/auth');
// we'll want to load the database module (knex) to make queries
var knex = require('../db/config').knex;

// router.post('/hello', function(req, res) {
//   console.log("hiii", req.body);
//   res.send("hi");
// });

/**
 *  router/wings.js
 *
 *  API endpint: /api/wings
 */
var wingid;
router.post('/add', function(req, res) {
  console.log("hi", req.body);
  // var tokenObj = auth.decode(req.headers['x-access-token']);
  // var clientID = tokenObj.ID;
  // var clientUsername = tokenObj.username;

  knex('users')
   .where('username', req.body.wingToAdd)
      .select('ID')
   .then(function(ID) {
      console.log('wingID retrieved from users table is', ID);
      wingid=ID;

     return wingid.forEach(function(currentId){
      console.log("line 33 the currentwingid is ", currentId);
        if(!currentId){
          res.send({
            success: false,
            message: 'User does not exist; no wing added.'
          })
        }
      });
   })
   .then(function() {
      console.log('line 36: wingid is ', wingid);
      knex('duos')
        .where('uID1', req.body.clientID)  
        .andWhere('uID2', wingid[0].ID)
        .select('ID')
        .select('status')
        .then(function(status){
          console.log('the Status is',status);
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
 });

// Get request route
router.get('/requests', function(req, res) {
  //Query Duos table w. clientID, retrieve DuoPK's client is part of
  knex('duos as d').where({ uID1: req.body.clientID })
   .join('users as u', 'd.uID2', '=', 'u.ID')
   .select('u.ID', 'u.firstname', 'u.lastname', 'd.status', 'u.currentWing')
   .then(function(resp) {
    resp.forEach(function(currentEl) {
      if (currentEl.ID === currentEl.currentWing) {
        knex('')
      }
    })
   })


});

  /**
   *  You'll notice that we use res.json({}) to send responses to our client
   *  regardless of whether the operation succeeded or not. This is because
   *  error codes are not as helpful, but a json object with a description
   *  of what occured 
   *
   */
// export router
module.exports = router;
