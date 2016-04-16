var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
var hp = require('../modules/helpers');
var db = require('../modules/duoHelpers.js');

/**
 *  router/wings.js
 *
 *  API endpint: /api/wings
 *
 */
router.post('/add', postAdd);
router.get('/wingRequests', getWingRequests);
router.post('/wingRequests', postWingRequests);
router.post('/addCurrent', postAddCurrent);
router.post('/current', postCurrent);

/**
 *  POST to /api/wings/add
 *  
 */
function postAdd(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;
  var wingToAdd = req.body.wingToAdd;
  var targetID;

  db.getUser(wingToAdd).then(function(user) {
    if (!user.length) {
      hp.sendJSON(res, false, 'That username does not exist!');

    } else if (user[0].ID === clientID) {
      hp.sendJSON(res, false, 'You can\'t add yourself as a wing!');

    } else {
      targetID = user[0].ID;
      processInfo();
    }
  });

  function processInfo() {
    db.getDuo(null, clientID, targetID).then(function(resp) {
      var duo = resp[0];

      // if client<->target exists
      if (duo) {
        var status = realStatus(duo, clientID);

        if (status === 'isWing' ||
            status === 'pendingCurrentWing' ||
            status === 'beCurrentWing' ||
            status === 'isCurrentWing') {
          hp.sendJSON(res, false, 'You are already wings with ' + wingToAdd + '!');

        } else if (status === 'pendingWing') {
          hp.sendJSON(res, false, 'You have already sent ' + wingToAdd + ' a wing request!');

        } else if (status === 'rejected') {
          hp.sendJSON(res, false, 'You are unable to add them as a wing at this time.');

        } else if (status === 'bePendingWing') {
          db.moveDuo('duosPen', 'duosAcc', targetID, clientID).then(function() {
            hp.sendJSON(res, true, 'You are now winged up with ' + wingToAdd + '!');
          });

        } else {
          throw 'something went wrong. Inside of processInfo() of wings.js. status = ' + status;
        }

      // if duo does not exist
      } else {
        db.newDuoEntry(clientID, targetID).then(function() {
          hp.sendJSON(res, true, 'You\'ve sent ' + wingToAdd + ' a wing request!');
        });
      }
    });

  } // end processInfo

} // end POST to /add

/**
 *  GET to /api/wings/wingRequests
 *
 */
function getWingRequests(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;

  var results = [];

  db.getAllDuosOf(clientID).then(function(resp) {
    var users = resp.map(function(duo) {
      // grab a more specific status to pass to client
      var statusForClient = realStatus(duo, clientID);
      var user;

      // format the user to be front-end friendly
      user = filterDuo(duo, clientID);
      user.status = statusForClient;
      return user;
    });

    hp.sendJSON(res, true, 'Here are all of your wings!', results.concat(users));
  });

} // end GET to /wingRequests

/**
 *  POST to /api/wings/wingRequests
 *
 */
function postWingRequests(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var targetID = req.body.targetID;
  var submittedStatus = req.body.accepted;

  acceptOrReject(submittedStatus, 'duosPen', clientID, targetID, accept, reject);

  function accept(duo) {
    db.acceptWing(duo.uID1, duo.uID2).then(function() {
      hp.sendJSON(res, true, 'You\'ve accepted their Wing Request!');
    });
  }

  function reject(duo) {
    db.rejectWing(duo.uID1, duo.uID2).then(function() {
      hp.sendJSON(res, true, 'You\'ve rejected their Wing Request.');
    })
  }

}; // end POST to /wingRequests

/**
 *  POST to /api/wings/addCurrent
 *
 */
function postAddCurrent(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var targetID = req.body.targetID;

  acceptOrReject(true, 'duosAcc', clientID, targetID, accept);

  function accept(duo) {

    var counter = new hp.Counter();
    counter.on(2, function() {
      hp.sendJSON(res, true, 'You\'ve submitted a current wing request!');
    });

    // swap the IDs if necessary
    if (duo.uID1 !== clientID) {
      db.swapUserIDs(duo.ID).then(function() {
        counter.plus();
      })
    } else {
      counter.plus();
    }

    db.insertDuoInto('duosCurPen', clientID, targetID).then(function() {
      counter.plus();
    });
  }
} // end POST to /addCurrent

/**
 *  POST to /api/wings/current
 *
 */
function postCurrent(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var targetID = req.body.targetID;
  var submittedStatus = req.body.accepted;

  // testing
  // var clientID = req.headers.clientid;

  acceptOrReject(submittedStatus, 'duosCurPen', clientID, targetID, accept, reject);

  function accept(duo) {
    db.acceptCurWing(duo.uID1, duo.uID2).then(function() {
      hp.sendJSON(res, true, 'You\'ve accepted their currentWing Request!');
    });
  }

  function reject(duo) {
    db.rejectCurWing(duo.uID1, duo.uID2).then(function() {
      hp.sendJSON(res, true, 'You\'ve rejected their currentWing Request.');
    });
  }

} // end POST to /current

/**
 *  Helper functions specific to route
 *
 */
function acceptOrReject(submittedStatus, expectedStatus, clientID, targetID, acceptCallback, rejectCallback) {
  db.getDuo(null, clientID, targetID).then(function(resp) {
    var duo = resp[0];
    if (duo.status !== expectedStatus) {
      throw 'Expecting duo.status to equal \'' + expectedStatus + '\'. Instead, got ' + duo.status;

    } else {
      if (submittedStatus) {
        acceptCallback(duo);
      } else {
        rejectCallback(duo);
      }
    }
  });
}

// Generate a 'real' status: something that reveals who gave consent first in a pending relationship.
function realStatus(duo, clientID) {
  // boolean, if the client is the first user (uID1) in our duos join table.
  var clientToTarget = duo.u1ID === clientID || duo.uID1 === clientID;
  var statusInDatabase = duo.status;
  var result;

  switch (statusInDatabase) {
    case 'duosPen':
      result = clientToTarget ? 'pendingWing' : 'bePendingWing';
      break;
    case 'duosAcc':
      result = 'isWing';
      break;
    case 'duosCurPen':
      console.log('duo = ', duo);
      console.log('clientToTarget = ', clientToTarget);
      result = clientToTarget ? 'pendingCurrentWing' : 'beCurrentWing';
      break;
    case 'duosCurAcc':
      result = 'isCurrentWing';
      break;
    case 'duosRej':
      result = 'rejected';
      break;
    default:
      throw 'status invalid! duo = ' + duo;
  }

  return result;
}

// Filter out the current user from a duo.
function filterDuo(duo, clientID) {
 // keep it pure
 var newUser = {};

 if (duo.u1ID === clientID) {
   newUser.ID = duo.u2ID;
   newUser.firstname = duo.u2fn;
   newUser.lastname = duo.u2ln;
 } else {
   newUser.ID = duo.u1ID;
   newUser.firstname = duo.u1fn;
   newUser.lastname = duo.u1ln;
 }

 return newUser;
}

// export router
module.exports = router;
