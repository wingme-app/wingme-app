var knex = require('./db/config.js').knex;

knex('users').then(function(resp) {
  console.log('users = ', resp);
  console.log('====================================')
});
