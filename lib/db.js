var sqlite3 = require("sqlite3");

var dbConfig = {
  client: 'sqlite3',
  connection: {
    filename: "./data/db.sqlite"
  },
  useNullAsDefault: true
};

var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

module.exports.knex = knex;
module.exports.bookshelf = bookshelf;