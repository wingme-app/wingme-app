var express=require('express');
var app=express();
var knex = require('./lib/db.js').knex;
var models = require('./db/models.js');
// var db=require('db');
// app.use(express.static(__dirname+'/'));



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



//   //user : 1 - duos : many
//   //duos : 1 - pairs : many



//   var Users = bookshelf.Model.extend({
// 	    tableName: 'users',
// 	    duos: function() {
// 	      return this.belongsTo(Duos);
// 	    }
// 	  });
   

  
//   var Duos = bookshelf.Model.extend({
// 	    tableName: 'duos',
// 	    users: function() {
// 	      return this.hasMany(Users);
// 	    },
// 	    pairs: function() {
// 	      return this.belongsTo(Pairs);
// 	    }
// 	  });



//   var Pairs = bookshelf.Model.extend({
// 	  	tableName: 'pairs',
// 	  	duos: function() {
// 	  	  return this.hasMany(Duos);
// 	  	}
// 		});
  



  
//knex.schema.dropTable('users');

knex('users')
   .insert({name: 'jess'})
   .then(function(name) { console.log(JSON.stringify(name)); })
   .catch(function(err) { console.log(err) });

// knex('users')
//    .insert({name: 'annie',
//             })
//    .then(function(name) { console.log(JSON.stringify(name)); })
//    .catch(function(err) { console.log(err) });

// knex('users')
//    .insert({name: 'ben',
//             })
//    .then(function(name) { console.log(JSON.stringify(name)); })
//    .catch(function(err) { console.log(err) });

// knex('users')
//    .insert({name: 'kan',
//             })
//    .then(function(name) { console.log(JSON.stringify(name)); })
//    .catch(function(err) { console.log(err) });


// knex('duos')
//    .insert({uID1: Duos.uID1,
//             uID2: Duos.uID2,
//             status : Duos.status})
//       .then(function(){console.log('duos 1 injected');})
//       .catch(function(err){console.log(err);})


// knex('duos')
//    .insert({uID1: Duos.uID1,
//             uID2: Duos.uID2,
//           status : Duos.status})
//       .then(function(){console.log('duos 2 injected');})
//       .catch(function(err){console.log(err);})


// knex('pairs')
//     .insert({dID1: Pairs.uID1,
//              dID2: Pairs.uID2,
//              status: Pairs.status})
//       .then(function(){console.log('pairs 1 injected');})
//       .catch(function(err){console.log(err);})


  // User.where('id', 1).fetch({withRelated: ['posts.tags']}).then(function(user) {
  //   console.log(user.related('posts').toJSON());
  // }).catch(function(err) {
  //   console.error(err);
  // });

var port=3000;
app.listen(port);
console.log("listening to port "+port);
