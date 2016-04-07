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

knex.schema.createTableIfNotExists('users', function (table) {
  table.increments();
  table.string('name');
  table.timestamps();
}).then(dbQueries);

function dbQueries() {

  var User = bookshelf.Model.extend({
    tableName: 'users',
    posts: function() {
      return this.hasMany(Posts);
    }
  });

  User.where('id', 1).fetch({withRelated: ['posts.tags']}).then(function(user) {
    console.log(user.related('posts').toJSON());
  }).catch(function(err) {
    console.error(err);
  });

}
