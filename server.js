var express=require('express');
var app=express();
var knex = require('./lib/db.js').knex;
var bodyParser = require('body-parser');
var path = require('path');
// var models = require('./db/models.js');
// var query = require('./db/query.js');
// var insert = require('./db/insert.js');
// var db=require('db');
app.use(express.static(__dirname+'/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/signup', require('./routes/signup'));
app.use('/api/login', require('./routes/login'));
app.use('/api/wings', require('./routes/wings.js'));


var port=3000;
app.listen(port);
console.log("listening to port "+port);
