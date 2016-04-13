var knex = require('../db/config.js').knex;

function makeUsers() {
  return knex('users').insert(users).then(function(resp) {
    console.log('users were created');
  }, function(err) {
    console.error('user insertion error. Users were not created. err = ', err);
  });
}

function makeDuos() {
  return knex('users').then(function(users) {
    users.forEach(function(user, userIndex) {
      if (userIndex >= users.length - 5) {
        return;
      }

      for (var i = 1; i < 5; i++) {
        knex('duos').insert({
          uID1: user.ID,
          uID2: user.ID + i,
          status: 'pending'
        }).then(function(resp) {
          console.log(resp);
        })
      }
    })
  })
}

function makePairs() {
  return knex('duos').then(function(duos) {
    duos.forEach(function(duo, duoIndex) {
      if (duoIndex >= duos.length - 5) {
        return;
      }

      for (var i = 1; i < 5; i++) {
        knex('pairs').insert({
          dID1: duo.ID,
          dID2: duo.ID + i,
          status: 'pending'
        }).then(function(resp) {
          console.log(resp);
        });
      }
    })
  })
}


// ------------------------------
// ------------------------------

var users = [
{
  username: 'kan',
  firstname: 'Kan',
  lastname: 'Adachi',
  email: 'kan@email.com',
  password: 'dog'
}, {
  username: 'ben',
  firstname: 'Ben',
  lastname: 'Richter',
  email: 'ben@email.com',
  password: 'dog'
}, {
  username: 'jessica',
  firstname: 'Jessica',
  lastname: 'Chou',
  email: 'jessica@email.com',
  password: 'dog'
}, {
  username: 'annie',
  firstname: 'Annie',
  lastname: 'Bai',
  email: 'annie@email.com',
  password: 'dog'
}, {
  username: 'avi',
  firstname: 'Avi',
  lastname: 'Samloff',
  email: 'avi@email.com',
  password: 'dog'
}, {
  username: 'daniel',
  firstname: 'Daniel',
  lastname: 'Chen',
  email: 'daniel@email.com',
  password: 'dog'
}, {
  username: 'daniel2',
  firstname: 'Daniel',
  lastname: 'Russel',
  email: 'daniel2@email.com',
  password: 'dog'
}, {
  username: 'ethan',
  firstname: 'Ethan',
  lastname: 'Rubio',
  email: 'ethan@email.com',
  password: 'dog'
}, {
  username: 'jonathan',
  firstname: 'Jonathan',
  lastname: 'Kvicky',
  email: 'jonathan@email.com',
  password: 'dog'
}, {
  username: 'hady',
  firstname: 'Hady',
  lastname: 'Wahby',
  email: 'hady@email.com',
  password: 'dog'
}, {
  username: 'jonathan2',
  firstname: 'Jonathan',
  lastname: 'Lee',
  email: 'jonathan2@email.com',
  password: 'dog'
}, {
  username: 'joseph',
  firstname: 'Joseph',
  lastname: 'Martin',
  email: 'joseph@email.com',
  password: 'dog'
}, {
  username: 'kaushik',
  firstname: 'Kaushik',
  lastname: 'Sahoo',
  email: 'kaushik@email.com',
  password: 'dog'
}, {
  username: 'kevin',
  firstname: 'Kevin',
  lastname: 'Chang',
  email: 'kevin@email.com',
  password: 'dog'
}, {
  username: 'mark',
  firstname: 'Mark',
  lastname: 'Kim',
  email: 'mark@email.com',
  password: 'dog'
}, {
  username: 'jane',
  firstname: 'Jane',
  lastname: 'Fong',
  email: 'jane@email.com',
  password: 'dog'
}
]

// run that shiz
// -----------------------------------------

makeUsers();

setTimeout(makeDuos, 2000);

setTimeout(makePairs, 4000);

// knex('pairs').then(function(resp) {
//   console.log(resp);
// })
