var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.json({hello: 'world'});
});

app.listen(5000, function () {
  console.log('Dummy API is available at http://localhost:5000');
});
