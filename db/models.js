var bookshelf = require('../lib/db.js').bookshelf;

var Users = bookshelf.Model.extend({
  tableName: 'users',
  duos: function() {
	return this.belongsTo(Duos);
  }
});
   
var Duos = bookshelf.Model.extend({
  tableName: 'duos',
  users: function() {
    return this.hasMany(Users);
  },
  pairs: function() {
	return this.belongsTo(Pairs);
  }
});

var Pairs = bookshelf.Model.extend({
  tableName: 'pairs',
  duos: function() {
	 return this.hasMany(Duos);
   }
});