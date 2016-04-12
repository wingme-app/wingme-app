var knex = require('../lib/db.js').knex;
var bookshelf = require('../lib/db.js').bookshelf;
function getUserId(name, callback) {
  knex('users')
   .where({ username: name })
    .select('ID')
     .then(function(id) {
       callback(id);
      })
     .catch(function(err) {
       console.log('Error in getting user ID',err);
      })
};

function getDuoId(name,callback) {
  var duoArray = [];
    getUserId(name, function(uId) {
      uId.forEach(function(currentEl) {
        duoArray.push(currentEl.ID);
      });
   
    knex('duos')
     .whereIn('uID1', duoArray)
      .orWhereIn('uID2', duoArray) 
        .select('ID')
         .then(function(duoIDs) {
            callback(duoIDs);
          })
         .catch(function(err) {
            console.log('Error in getting duoIDs 1.', err);
         })
    })
};
 
function getPairId(name, callback) {
  var pairArray = [];
   	getDuoId(name,function(dId) {
   		dId.forEach(function(currentEl) {
        pairArray.push(currentEl.ID);
      });

    knex('pairs')
   	  .whereIn('dID1',pairArray)
        .orWhereIn('dID2',pairArray)
   	      .select('ID')
   	       .then(function(pairIDs) {
   		       callback(pairIDs);
   	        })
   	       .catch(function(err) {
   	    	   console.log('Error in getting pairIDs.',err);
   	       })
   	})
};