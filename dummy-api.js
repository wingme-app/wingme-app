var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors')
var jwt = require('jsonwebtoken');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// cors
app.use(cors());

//* ---------------------------------------------
//* ---------------------------------------------

// Sample data
var users = [];

users.push({
  userID: 1,
  username: 'Ben'
}, {
  userID: 2,
  username: 'Kan'
}, {
  userID: 3,
  username: 'Annie'
}, {
  userID: 4,
  username: 'Jessica'
}, {
  userID: 5,
  username: 'Jane'
}, {
  userID: 6,
  username: 'Tiffany'
});

var duos = [];

duos.push({
  duoID: 1,
  users: [ users[0].username, users[1].username, ],
  imageURL: 'http://www.yoyowall.com/wallpapers/2013/04/Pair-Penguins-485x728.jpg'
}, {
  duoID: 2,
  users: [ users[2].username, users[3].username ],
  imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Pair_of_white_domesticated_ducks.jpg/1024px-Pair_of_white_domesticated_ducks.jpg'
}, {
  duoID: 3,
  users: [ users[4].username, users[5].username ],
  imageURL: 'http://cdn1.arkive.org/media/1D/1DC4E7FA-9E5C-493E-90B4-44D436BDED0B/Presentation.Large/Collared-dove-pair.jpg'
});

//* ---------------------------------------------
//* ---------------------------------------------

/** ---------------------------------------------
 *  Add Wing
 *
 */
app.post('/api/wings/add', function(req, res) {
  /**
   *  This is for a post request coming to /api/wings/add
   *  To be used on the addwing tab
   *
   *  The server is expecting a JSON/Application body as part of a POST request.
   *  { "wingToAdd" : "Ben" }
   *
   *  The server will respond with a 200 status if the value of "wingToAdd" evaluates to false
   *  The server will respond with a 500 status if the value of "wingToAdd" evalutes to true
   */
  console.log('=============');
  console.log(req.method + ' received: ' + req.url);

  if (!req.body.wingToAdd) {
    console.error('ERR: req.body = ' + req.body);
    console.error('ERR: req.body.wingToAdd = ' + req.body.wingToAdd);
    res.sendStatus(500);
  } else {
    console.log('SUCCESS');
    res.send();
  }
});


/** ---------------------------------------------
 *  Wing Requests
 *
 */
 app.get('/api/wings/requests', function(req, res) {
   /**
    *  This is for a GET request coming to /api/wings/requests
    *  To be used on the wing requests tab to retrieve a list of wing requests (potential wings)
    *
    *  The server is not expecting anything in the headers (for now).
    *
    *  The server will respond with a 200 or
    *  The server will respond with a 500 on error (rules TBD)
    */
  console.log('=============');
  console.log(req.method + ' received: ' + req.url);

  var results = users.slice().filter(function(user) {
    // some kind of filtering will occur here.
    return user.userID !== 1;
  });

  console.log('SUCCESS');
  res.send({potentialWings: results});
 });

app.post('/api/wings/requests', function(req, res) {
  /**
   *  This is for a POST request coming to /api/wings/requests
   *  To be used on the wing requests tab
   *
   *  The server is expecting a JSON/Application body as part of a POST request.
   *  {
   *    "wing" : "WINGNAME"
   *    "accepted" : true/false
   *  }
   *
   *  The server will respond with a 200 status if value types match
   *  The server will respond with a 500 status otherwise
   */
  console.log('=============');
  console.log(req.method + ' received: ' + req.url);

  if ("wing" in req.body &&
      "accepted" in req.body &&
      typeof req.body.wing === "string" &&
      typeof req.body.accepted === "boolean"
    ) {
    console.log('SUCCESS');
    res.send();
  } else {
    console.error('ERR: req.body = ' + req.body);
    console.error('ERR: req.body.wing = ' + req.body.wing);
    console.error('ERR: req.body.accepted = ' + req.body.accepted);
    res.sendStatus(500);
  }
});


/** ---------------------------------------------
 *  Find Duo
 *
 */
 app.get('/api/duos/find', function(req, res) {
   /**
    *  This is for a GET request coming to /api/duos/find
    *  To be used on the find duo page to retrieve a list of potential duos
    *
    *  The server is not expecting anything in the headers (for now).
    *
    *  The server will respond with a 200 or
    *  The server will respond with a 500 on error (rules TBD)
    */
  console.log('=============');
  console.log(req.method + ' received: ' + req.url);

  var results = duos.slice().filter(function(duo) {
    // some kind of filtering will occur here
    return duo.duoID !== 1;
  });

  console.log('SUCCESS');
  res.send({results: results});
 });

app.post('/api/duos/find', function(req, res) {
  /**
   *  This is for a POST request coming to /api/duos/find
   *  To be used on the find duo page to accept/deny another duo as a "pair" (of duos)
   *
   *  The server is expecting a JSON/Application body as part of a POST request.
   *  {
   *    "currentDuoID" : currentDuoID,
   *    "targetDuoID" : targetDuoID,
   *    "accepted" : true/false
   *  }
   *
   *  The server will respond with a 200 status if value types match
   *  The server will respond with a 500 status otherwise
   */
  console.log('=============');
  console.log(req.method + ' received: ' + req.url);

  if ("currentDuoID" in req.body &&
      "targetDuoID" in req.body &&
      "accepted" in req.body &&
      typeof req.body.currentDuoID === "number" &&
      typeof req.body.targetDuoID === "number" &&
      typeof req.body.accepted === "boolean"
    ) {
    console.log('SUCCESS');
    res.send();
  } else {
    console.error('ERR: req.body = ' + req.body);
    console.error('ERR: req.body.currentDuoID = ' + req.body.currentDuoID);
    console.error('ERR: req.body.targetDuoID = ' + req.body.targetDuoID);
    console.error('ERR: req.body.accepted = ' + req.body.accepted);
    res.sendStatus(500);
  }
});


/** ---------------------------------------------
 *  Pending Duos
 *
 */
app.get('/api/duos/', function(req, res) {
  /**
   *  This is for a GET request coming to /api/duos/
   *  To be used on the 'my duos' page to retrieve a list of pending/accepted/denied wings.
   *
   *  The server is expecting a JSON/Application body as part of a POST request.
   *  {
   *    "currentDuoID" : currentDuoID
   *  }
   *
   *  The server will respond with a 200 status if value types match
   *  The server will respond with a 500 status otherwise
   */
  console.log('=============');
  console.log(req.method + ' received: ' + req.url);

  var results = duos.slice().filter(function(duo) {
    // some kind of filtering will occur here
    return duo.duoID !== 1;
  });

  results[0].status = "pending";
  results[1].status = "accepted";

  console.log(results);

  console.log('SUCCESS');
  res.send({results: results});
 });

/** ---------------------------------------------
 *  Authentication
 *  --------------
 *
 *  For the sake of this dummy authentication api, the users variable below is our mock database.  
 *  
 */
var authedUsers = {};
var tokenSecret = 'CouchBaseRocks';

// sign up handler
app.post('/api/signup', function(req, res) {
  var user = req.body.username;
  var pass = req.body.password;

  // if user and password are not BOTH filled out
  if (!user && !pass) {
    res.json({
      success: false,
      message: 'Please provide both a username and password.'
    });

  } else {

    // if user already exists
    if (user in authedUsers) {
      res.json({
        success: false,
        message: user + ' already exists in our database!'
      });

    // if all checks out, store user and pass in authedUsers
    // NOTE: We would never store the password in plain text like this.
    // We should be using something like bcrypt with a salt to hash it.
    } else {
      authedUsers[user] = pass;
      
      var token = jwt.sign({username: user}, tokenSecret, {
        expiresIn: 47700
      });

      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
      });
    }
  }
});

// sign in handler
app.post('/api/login', function(req, res) {
  var user = req.body.username;
  var pass = req.body.password;

  // if user does not exist
  if (!authedUsers[user]) {
    res.json({
      success: false,
      message: 'Authentication failed. User not found.'
    });

  // if user exists
  } else {

    // but password is wrong
    if (authedUsers[user] !== pass) {
      res.json({
        success: false,
        message: 'Authentication failed. Password is incorrect.'
      });

    // if all checks out
    } else {
      var token = jwt.sign({username: user}, tokenSecret, {
        expiresIn: 47700
      });

      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
      });
    }
  }
}); // end authentication


var port = 8000;
app.listen(port, function () {
  console.log('Dummy API is available at http://localhost:', port);
});
