var knex = require('./db/config.js').knex;

knex('duos').update({
  cwStatus: null
}).then(function() {
  console.log('set to null');
});
