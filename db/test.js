var knex = require('../db/config.js').knex;

var clientID = 1;

knex('duos as d')
  .where('uID1', clientID)
  .andWhere('cwStatus', 'pending')
  .join('users as u', 'd.uID2', '=', 'u.ID')
  .select('d.ID', 'u.ID', 'u.firstname', 'u.lastname')
  .then(function(resp) {
    console.log(resp);
  });
