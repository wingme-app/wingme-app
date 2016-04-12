var bookshelf = require('../lib/db.js').bookshelf;

var Users = bookshelf.Model.extend({
  tableName: 'users',
  duos: function() {
	  return this.hasMany(Duos);
  }
});
   
var Duos = bookshelf.Model.extend({
  tableName: 'duos',
  users: function() {
    return this.belongsTo(Users);
  },
  pairs: function() {
	  return this.hasMany(Pairs);
  }
});

var Pairs = bookshelf.Model.extend({
  tableName: 'pairs',
  duos: function() {
	  return this.belongsTo(Duos);
  }
});