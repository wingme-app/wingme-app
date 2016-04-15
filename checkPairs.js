var knex = require('./db/config.js').knex;

knex('pairsPending').then(function(resp) {
  console.log('pairsPending = ', resp);
  console.log('====================================')
})


knex('pairsAccepted').then(function(resp) {
  console.log('pairsAccepted = ', resp);
  console.log('====================================')
})
