var knex = require('./db/config.js').knex;

knex('duos').then(function(resp) {
  console.log('duos = ', resp);
  console.log('====================================')
});
