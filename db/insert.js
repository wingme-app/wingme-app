var knex = require('../lib/db.js').knex;
var bookshelf = require('../lib/db.js').bookshelf;
var models = require('./models.js');
knex('users')
   .insert({username: Users.username,
            firstname: Users.firstname,
            lastname: Users.lastname,
            email: Users.email,
            password: Users.password})
   .then(function(username,firstname,lastname,email,password) { 
                          console.log(JSON.stringify(username));
                          console.log(JSON.stringify(firstname));
                          console.log(JSON.stringify(lastname));
                          console.log(JSON.stringify(email));
                          console.log(JSON.stringify(password));
                        })
   .catch(function(err) { console.log('err in users insert is ', err) });

knex('duos')
   .insert({uID1: Duos.uID1,
            uID2: Duos.uID2,
            status : Duos.status})
      .then(function(){console.log('duos injected');})
      .catch(function(err){console.log('err in duos insert is ', err);})

knex('pairs')
    .insert({dID1: Pairs.dID1,
             dID2: Pairs.dID2,
             status: Pairs.status})
      .then(function(){console.log('pairs injected');})
      .catch(function(err){console.log('err in pairs insert is ', err);})


