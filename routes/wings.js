var express = require('express');
var router = express.Router();
// var auth = require('../modules/auth');

// we'll want to load the database module (knex) to make queries
var knex = require('../db/config.js').knex;

// router.post('/hello', function(req, res) {
//   console.log("hiii", req.body);
//   res.send("hi");
// });
/**
 *  router/signup.js
 *
 *  API endpint: /api/signup
 */

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
     return ID;
   })
   .then(function(wingid){
    if (wingid.length===0) {
      res.send({
        success: false,
        message: 'User does not exist; no wing added.'
      })
    } 
      
      knex('duos')
      .where('uID1', req.body.clientID)
      .orWhere('uID2', req.body.clientID)
      .select('ID')
      .then(function(ID) {
          console.log('clientDuoArr is',ID);
          return ID;
        })
          // knex('duos')
          // .whereIn('ID',clientDuoArr)
           //.where('uID1', wingid)
    //         .orWhere('uID2', wingid)
    //          .select('ID', 'status')
    //           if( 'status' ===false){
                
    //             res.send({
    //               status:true,
    //               message:'Your wing is added!'
    //               })
    //           }
    //           else if('status'===true){

    //             res.send({
    //               message: 'You are already wings!'
    //               })
    //           }
    //          })
    // // }
       
  
    //   })
   //  .catch(function(err) {
   //   console.log('Error is', err);
   // })


})
})

// .then(function(wingid){
//     if (!wingid) {
//       wingid.JSON({
//         success: false,
//         message: 'User does not exist; no wing added.'
//       })
//     } else {
//       // resp should be the ID of the wingtoAdd username
//       // if so, set user.wingToAdd to resp ?
//       // eg. wingToAdd: 3
//       knex('duos')
//       // changed resp to clientID
//       .whereIn('uID1', clientID)
//        .orWhereIn('uID2', clientID)
//         .select('ID')
//         .then(function(clientDuoArr) {
//           knex('duos')
//           // .whereIn('ID',clientDuoArr)
//            .where('uID1',wingid )
//             .orWhere('uID2',wingid)
//              .select('ID',status)
//               if(status===false){
                
//                 res.JSON({
//                   status:true,
//                   message:'Your wing is added!'
//                   })
//               }
//               else if(status===true){

//                 res.JSON({
//                   message: 'You are already wings!'
//                   })
//               }
//              })
//         }
       
  
//       })



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
