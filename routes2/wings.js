var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
var hp = require('../modules/helpers');
var db = require('../modules/duoHelpers.js');

/**
 *  router/wings.js
 *
 *  API endpint: /api/wings
 */

router.post('/add', function(req, res) {
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
        var status = hp.realStatus(duo, clientID);

        if (status === 'isWing' || status === 'pendingCurrentWing' || status === 'beCurrentWing') {
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
          throw 'something went wrong. status = ' + status;
        }

      // if duo does not exist
      } else {
        db.newDuoEntry(clientID, targetID).then(function() {
          hp.sendJSON(res, true, 'You\'ve sent ' + wingToAdd + ' a wing request!');
        });
      }
    });

  } // end processInfo

}); // end POST to /add

router.get('/wingRequests', function(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;

  var results = [];

  db.getAllDuosOf(clientID).then(function(resp) {
    var users = resp.map(function(duo) {
      // grab a more specific status to pass to client
      var statusForClient = hp.realStatus(duo, clientID);
      var user;

      // format the user to be front-end friendly
      user = hp.filterDuo(duo, clientID);
      user.status = statusForClient;
      return user;
    });

    hp.sendJSON(res, true, 'Here are all of your wings!', results.concat(users));
  });

}); // end GET to /wingRequests

router.post('/wingRequests', function(req, res) {
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

});

router.post('/addCurrent', function(req, res) {
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
});

router.post('/current', function(req, res) {
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

}); // end POST to /current

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

// export router
module.exports = router;
