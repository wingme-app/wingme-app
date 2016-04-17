var knex = require('./db/config.js').knex;

knex('duos')
  .whereIn('ID', [1,3])
  .update('cwStatus', 'active')
  .then(function() {
    console.log('Kan has requested Ben(ID:2) and Jessica(ID:3) to be a wing.')
  });
