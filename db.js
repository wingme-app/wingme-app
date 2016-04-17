var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./data/dummy-db.sqlite"
  },
  useNullAsDefault: true
});

module.exports = knex;
