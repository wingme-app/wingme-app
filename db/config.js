var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./data/dummy-db.sqlite"
  },
  useNullAsDefault: true
});

var Bookshelf = require('bookshelf')(knex);
var bookshelf = Bookshelf;

knex.schema.createTableIfNotExists('users', function (table) {
  table.increments('ID').primary();
  table.string('username');
  table.string('firstname');
  table.string('lastname');
  table.string('email');
  table.string('password');
}).then(function(){
	console.log('Users schema created.');
});

knex.schema.createTableIfNotExists('duos', function (table) {
  table.increments('ID').primary();
  table.integer('uID1');
  table.integer('uID2');
  table.string('status');
  table.string('imageURL');
  table.foreign('uID1').references('users.ID');
  table.foreign('uID2').references('users.ID');
}).then(function(){
	console.log('Duos schema created.');
});

knex.schema.createTableIfNotExists('duosRej', function (table) {
  table.increments('ID').primary();
  table.integer('dID');
  table.integer('uID1');
  table.integer('uID2');
  table.foreign('uID1').references('users.ID');
  table.foreign('uID2').references('users.ID');
}).then(function(){
  console.log('Duos schema created.');
});

knex.schema.createTableIfNotExists('duosPen', function (table) {
  table.increments('ID').primary();
  table.integer('uID1');
  table.integer('uID2');
  table.foreign('uID1').references('users.ID');
  table.foreign('uID2').references('users.ID');
}).then(function(){
  console.log('Duos schema created.');
});

knex.schema.createTableIfNotExists('duosAcc', function (table) {
  table.increments('ID').primary();
  table.integer('uID1');
  table.integer('uID2');
  table.foreign('uID1').references('users.ID');
  table.foreign('uID2').references('users.ID');
}).then(function(){
  console.log('Duos schema created.');
});

knex.schema.createTableIfNotExists('duosCurPen', function (table) {
  table.increments('ID').primary();
  table.integer('uID1');
  table.integer('uID2');
  table.foreign('uID1').references('users.ID');
  table.foreign('uID2').references('users.ID');
}).then(function(){
  console.log('Duos schema created.');
});

knex.schema.createTableIfNotExists('duosCurAcc', function (table) {
  table.increments('ID').primary();
  table.integer('uID1');
  table.integer('uID2');
  table.foreign('uID1').references('users.ID');
  table.foreign('uID2').references('users.ID');
}).then(function(){
  console.log('Duos schema created.');
});

knex.schema.createTableIfNotExists('pairs', function (table) {
  table.increments('ID').primary();
  table.integer('dID1');
  table.integer('dID2');
  table.string('status');
  table.foreign('dID1').references('duos.ID');
  table.foreign('dID2').references('duos.ID');
}).then(function(){
  console.log('Pairs schema created.');
});

knex.schema.createTableIfNotExists('pairsRejected', function (table) {
  table.increments('ID').primary();
  table.integer('dID1');
  table.integer('dID2');
  table.foreign('dID1').references('duos.ID');
  table.foreign('dID2').references('duos.ID');
}).then(function(){
  console.log('Pairs schema created.');
});

knex.schema.createTableIfNotExists('pairsPending', function (table) {
  table.increments('ID').primary();
  table.integer('dID1');
  table.integer('dID2');
  table.foreign('dID1').references('duos.ID');
  table.foreign('dID2').references('duos.ID');
}).then(function(){
	console.log('Pairs schema created.');
});

knex.schema.createTableIfNotExists('pairsAccepted', function (table) {
  table.increments('ID').primary();
  table.integer('dID1');
  table.integer('dID2');
  table.foreign('dID1').references('duos.ID');
  table.foreign('dID2').references('duos.ID');
}).then(function(){
  console.log('Pairs schema created.');
});


module.exports = {
  knex: knex,
  bookshelf: bookshelf
}
