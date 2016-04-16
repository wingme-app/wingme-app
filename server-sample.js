var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
var config = require('./modules/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// cors
app.use(cors());

//* ---------------------------------------------
//* ---------------------------------------------


// run schema if needed:
// require('./db/config.js');


//* ---------------------------------------------
//* ---------------------------------------------


/** 
 *  We use express router to set up our routes in a modular fashion.
 *
 *  Here are the various api routes for our application.
 *  take a look inside these files to get a feel for how express router works.
 *
 *  You can also look here for documentation:
 *  @url: http://expressjs.com/en/guide/routing.html#express-router
 */
app.use('/api/signup', require('./routes2/signup'));
app.use('/api/login', require('./routes2/login'));
app.use('/api/wings', require('./routes2/wings'));
app.use('/api/pairs', require('./routes2/pairs'));




var port = config.port;
app.listen(config.port, function () {
  console.log('The server is available at http://localhost:', port);
});
