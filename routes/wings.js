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
                res.send({
                  success: true,
                  message: 'Your wing is added!'
                })
              }
              else if(currentEl.status === 'ok'){
                res.send({
                  success: false,
                  message: 'You are already wings!'
                })
              }
              else if(currentEl.status === 'null') {
                //use knex query to update status
                res.send({
                 success: true,
                 message: 'Status is now pending!'
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
router.post('/requests', function(req, res) {


});
  /**
   *  You'll notice that we use res.json({}) to send responses to our client
   *  regardless of whether the operation succeeded or not. This is because
   *  error codes are not as helpful, but a json object with a description
   *  of what occured 
   *
   */

//   // data validation
//   if (!validate(user)) {
//     res.json({
//       success: false,
//       message: 'User information validation failed.'
//     });

//   // if data validation passes, insert user object into database
//   } else {
//     knex('users').insert(user)
//       .then(function(ID) {
//         user.ID = ID[0];

//         res.json({
//           success: true,
//           message: 'User inserted into database. Enjoy your token!',
//           token: auth.genToken(user)
//         });
//       }, function(err) {
//         var message = err.code;
        
//         if (err.errno === 19) {
//           message = 'username already exists!'
//         }
//         res.json({
//           success: false,
//           message: message
//         });
//       });
//   }

// // helper functions
// function validate(user) {
//   console.log(user);
//   return user.username && user.firstname && user.lastname && user.email && user.password;
// }

// export router
module.exports = router;
