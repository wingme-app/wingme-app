var knex = require('../lib/db.js').knex;

knex.schema.createTableIfNotExists('users', function (table) {
  table.increments('ID').primary();
  table.string('name');
}).then(function(){
	console.log('Users schema created.');
});

knex.schema.createTableIfNotExists('duos', function (table) {
  table.increments('ID').primary();
  table.integer('uID1');
  table.integer('uID2');
  table.string('status');
  table.foreign('uID1').references ('users.ID');
  table.foreign('uID2').references ('users.ID');
}).then(function(){
	console.log('Duos schema created.');
});

knex.schema.createTableIfNotExists('pairs', function (table) {
  table.increments('ID').primary();
  table.integer('dID1');
  table.integer('dID2');
  table.string('status');
  table.foreign('dID1').references ('duos.ID');
  table.foreign('dID2').references ('duos.ID');
}).then(function(){
	console.log('Pairs schema created.');
});