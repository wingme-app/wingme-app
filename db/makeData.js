var knex = require('../db/config.js').knex;

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

// knex('duos').then(function(resp) {

//   for (var i = 0; i < resp.length; i+=2) {
//     knex('pairs').insert({
//       dID1: resp[i].ID,
//       dID2: resp[i+1].ID
//     }).then(function(resp) {
//       console.log(resp);
//     });
//   }

// });

// knex('pairs').then(function(resp) {
//   for (var i = 0; i < resp.length; i++) {
//     var status;
//     if (i % 3 === 0) {
//       status = null
//     } else if (i % 3 === 1) {
//       status = 'pending'
//     } else {
//       status = 'accepted'
//     }
//     knex('pairs')
//       .where({ID: resp[i].ID})
//       .update({
//         status: status
//       }).then(function(resp) {});
//   }
// })

knex('pairs')
  .whereIn('dID1', [2, 1])
  .whereIn('dID2', [1, 2])
  .then(function(resp) {
    console.log(resp);
  });

// setTimeout(function() {

//   // knex('duos as d')
//   //   .join('users as u1', 'd.uID1', '=', 'u1.ID')
//   //   .join('users as u2', 'd.uID2', '=', 'u2.ID')
//   //   .select('d.ID', 'u1.firstname as user1', 'u2.firstname as user2')
//   //   .then(function(resp) {
//   //     console.log(resp);
//   //   })

//   knex('duos as d')
//     .whereNotIn('d.uID1', [1])
//     .whereNotIn('d.uID2', [1])
//     .join('users as u1', 'd.uID1', '=', 'u1.ID')
//     .join('users as u2', 'd.uID2', '=', 'u2.ID')
//     .select('d.ID', 'u1.firstname as user1', 'u2.firstname as user2')
//     .then(function(resp) {
//       console.log(resp);
//     });


// }, 1000);
