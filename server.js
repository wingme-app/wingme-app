var express=require('express');
var app=express();
var knex = require('./lib/db.js').knex;
var bodyParser = require('body-parser');
var path = require('path');
// var models = require('./db/models.js');
// var query = require('./db/query.js');
// var insert = require('./db/insert.js');
// var db=require('db');
app.use(express.static(__dirname+'/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/signup', require('./routes/signup'));
app.use('/api/login', require('./routes/login'));
app.use('/api/wings', require('./routes/wings.js'));



// var sqlite3 = require("sqlite3");

// var dbConfig = {
//   client: 'sqlite3',
//   connection: {
//     filename: "./data/db.sqlite"
//   },
//   useNullAsDefault: true
// };

// var knex = require('knex')(dbConfig);
// var bookshelf = require('bookshelf')(knex);

// knex.schema.createTableIfNotExists('users', function (table) {
//   table.increments('ID').primary();
//   table.string('name');
// }).then(function(){

// 	console.log('users table created');
// });

// knex.schema.createTableIfNotExists('duos', function (table) {
//   table.increments('ID').primary();
//   table.integer('uID1');
//   table.integer('uID2');
//   table.string('status');
//   table.foreign('uID1').references ('users.ID');
//   table.foreign('uID2').references ('users.ID');
// }).then(function(){

// 	console.log('duos table created');
// });

// knex.schema.createTableIfNotExists('pairs', function (table) {
//   table.increments('ID').primary();
//   table.integer('dID1');
//   table.integer('dID2');
//   table.string('status');
//   table.foreign('dID1').references ('duos.ID');
//   table.foreign('dID2').references ('duos.ID');
// }).then(function(){

// 	console.log('pairs table created');
// });



  //user : 1 - duos : many
  //duos : 1 - pairs : many



  // var Users = bookshelf.Model.extend({
	 //    tableName: 'users',
	 //    duos: function() {
	 //      return this.belongsTo(Duos);
	 //    }
	 //  });
   

  
  // var Duos = bookshelf.Model.extend({
	 //    tableName: 'duos',
	 //    users: function() {
	 //      return this.hasMany(Users);
	 //    },
	 //    pairs: function() {
	 //      return this.belongsTo(Pairs);
	 //    }
	 //  });



  // var Pairs = bookshelf.Model.extend({
	 //  	tableName: 'pairs',
	 //  	duos: function() {
	 //  	  return this.hasMany(Duos);
	 //  	}
		// });
  


  // function getUserId(name, callback) {
  //   knex('users')
  //   .where({ username: name })
  //     .select('ID')
  //   .then(function(id) {
  //       callback(id);
  //   })
  //   .catch(function(err) {
  //       console.log('Error in getting user ID',err);
  //   })
  // }

  // function getDuoId(name,callback) {
  //   var duoArray = [];
  //     getUserId(name, function(uId) {
  //       uId.forEach(function(currentEl) {
  //         duoArray.push(currentEl.ID);
  //       });
   
  //     knex('duos')
  //      .whereIn('uID1', duoArray)
  //       .orWhereIn('uID2', duoArray) 
  //        .select('ID')
  //  //do we also need to return users associated with this duoID
  //          .then(function(duoIDs) {
  //            callback(duoIDs);
  //          })
  //          .catch(function(err) {
  //            console.log('Error in getting duoIDs 1.', err);
  //          })
  //     })
  // }
 
 
  //  function getPairId(name, callback) {
  //  	  var pairArray = [];
  //  	    getDuoId(name,function(dId) {
  //  		    dId.forEach(function(currentEl) {
  //         pairArray.push(currentEl.ID);
  //       });

  //       knex('pairs')
  //  	     .whereIn('dID1',pairArray)
  //        .orWhereIn('dID2',pairArray)
  //  	      .select('ID')
  //  	       .then(function(pairIDs) {
  //  		       callback(pairIDs);
  //  	        })
  //  	       .catch(function(err) {
  //  	    	   console.log('Error in getting pairIDs.',err);
  //  	       })
  //  	    })
  //  };

  // getUserId('kan',function(userIDs) {
  //   console.log('Kans userIDs:', userIDs);
  // });

  // getDuoId('kan',function(duoIDs) {
  //   console.log('Kans duoIDs:', duoIDs);
  // });

  // getPairId('kan',function(pairIDs) {
  //   console.log('Kans pairIDs:', pairIDs);
  // });
  

// knex('users')
//    .insert({username: Users.username,
//             firstname: Users.firstname,
//             lastname: Users.lastname,
//             email: Users.email,
//             password: Users.password})
//    .then(function(username,firstname,lastname,email,password) { 
//                           console.log(JSON.stringify(username));
//                           console.log(JSON.stringify(firstname));
//                           console.log(JSON.stringify(lastname));
//                           console.log(JSON.stringify(email));
//                           console.log(JSON.stringify(password));
//                         })
//    .catch(function(err) { console.log('err in users insert is ', err) });

// knex('users')
//    .insert({username: 'annie',
//             })
//    .then(function(name) { console.log(JSON.stringify(name)); })
//    .catch(function(err) { console.log(err) });

// knex('users')
//    .insert({username: 'ben',
//             })
//    .then(function(name) { console.log(JSON.stringify(name)); })
//    .catch(function(err) { console.log(err) });

// knex('users')
//    .insert({username: 'kan',
//             })
//    .then(function(name) { console.log(JSON.stringify(name)); })
//    .catch(function(err) { console.log(err) });


// knex('duos')
//    .insert({uID1: Duos.uID1,
//             uID2: Duos.uID2,
//             status : Duos.status})
//       .then(function(){console.log('duos injected');})
//       .catch(function(err){console.log('err in duos insert is ', err);})


// // knex('duos')
// //    .insert({uID1: 15,
// //             uID2: 16,
// //           status : 'ok'})
// //       .then(function(){console.log('duos 2 injected');})
// //       .catch(function(err){console.log(err);})


// knex('pairs')
//     .insert({dID1: Pairs.dID1,
//              dID2: Pairs.dID2,
//              status: Pairs.status})
//       .then(function(){console.log('pairs injected');})
//       .catch(function(err){console.log('err in pairs insert is ', err);})


var port=3000;
app.listen(port);
console.log("listening to port "+port);
