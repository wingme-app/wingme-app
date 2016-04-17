var knex = require('./db/config.js').knex;

knex('pairs').then(function(resp) {
  console.log('pairs = ', resp);
  console.log('====================================')
})

knex('pairsPending').then(function(resp) {
  console.log('pairsPending = ', resp);
  console.log('====================================')
})


knex('pairsAccepted').then(function(resp) {
  console.log('pairsAccepted = ', resp);
  console.log('====================================')
})


knex('pairsRejected').then(function(resp) {
  console.log('pairsRejected = ', resp);
  console.log('====================================')
})
