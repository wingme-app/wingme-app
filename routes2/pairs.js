var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
var hp = require('../modules/helpers');
var db = require('../modules/pairHelpers');
var config = require('../modules/config');

var getRandomImage = imageGenerator();

/**
 *  router/wings.js
 *
 *  API endpint: /api/wings
 *
 */
router.get('/', getPairs);
router.post('/', postPairs);

/**
 *  POST to /api/pairs/
 *  
 */
function getPairs(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;

  var result = [];
  var pairs = {};


  db.getDuoID(clientID).then(function(clientDuoID) {
    step1(clientDuoID);
  });

  function step1(clientDuoID) {
    // step 1: find all pairs that the client has requested, has been requested, or has mutually approved.
    db.getAllPairsOf(clientDuoID).then(function(resp) {

      // this filters the pairs into relevant duoIDs
      resp.forEach(function(pair) {
        var wasFirst = pair.dID1 === clientDuoID
        var targetDuoID = wasFirst ? pair.dID2 : pair.dID1;

        if (pair.status === 'pairsAccepted') {
          pair.status = 'isPair';

        } else if (pair.status === 'pairsPending') {
          pair.status = wasFirst ? 'pendingPair' : 'bePendingPair';

        } else if (pair.status === 'pairsRejected') {
          pair.status = 'rejected';

        } else {
          throw 'Inside of pairs.map. unexpected status value. pair.status = ' + pair.status;
        }

        delete pair.dID1;
        delete pair.dID2;
        pair.duoID = targetDuoID;
        pairs[pair.duoID] = pair;
      });

      step2(clientDuoID);
    });
  }

  // convert the other duos into user info and duo images
  function step2(clientDuoID) {

    db.getUsersOf(Object.keys(pairs)).then(function(resp) {
      duos = resp.map(function(duo) {
        // duoID is key
        duo.status = pairs[duo.duoID].status;
        duo.imageURL = duo.imageURL || getRandomImage();
        return duo;
      });
      result = result.concat(duos);

      step3(clientDuoID);
    });

  }

  // get random duos, but filter the ones that were already found from pairs
  function step3(clientDuoID) {

    db.getAllDuos(clientID).then(function(duos) {

      var randomDuos = [];
      duos.forEach(function(duo) {
        if (!pairs[duo.duoID] && duo.duoID !== clientDuoID) {
          duo.status = null;
          duo.imageURL = duo.imageURL || getRandomImage();
          console.log(duo.imageURL);
          randomDuos.push(duo);
        }
      })
      result = result.concat(randomDuos);

      hp.sendJSON(res, true, 'Here are all of your duos', result);
    });
  }
} 

/**
 *  POST to /api/pairs/
 *  
 */
function postPairs(req, res) {
  var tokenObj = auth.decode(req.headers['x-access-token']);
  var clientID = tokenObj.ID;
  var clientUsername = tokenObj.username;

  var targetDuoID = req.body.targetDuoID;
  var pairStatus = req.body.pairStatus; // bePendingPair or null
  var submittedStatus = req.body.accepted; // true or false

  db.getDuoID(clientID).then(function(ID) {
    acceptOrReject(ID);
  });

  function acceptOrReject(clientDuoID) {

    if (submittedStatus && pairStatus) {
      db.movePair('pairsPending', 'pairsAccepted', clientDuoID, targetDuoID).then(function() {
        hp.sendJSON(res, true, 'You\'ve accepted their match request!');
      });

    } else if (submittedStatus) {
      db.insertNewPair(clientDuoID, targetDuoID).then(function() {
        hp.sendJSON(res, true, 'You\'ve sent them a match request.');
      });

    } else {
      db.movePair('pairsPending', 'pairsRejected', clientDuoID, targetDuoID).then(function() {
        hp.sendJSON(res, true, 'You\'ve rejected their match request!');
      });
    }
  }
}

/**
 *  Helper Functions
 *
 */
function imageGenerator() {
  var options = ['./img/dog-kitten.jpg', './img/cute-dog-and-cat-4.gif', './img/cat-and-dog-friends-001.jpg']
  var count = 0;

  return function() {
    if (++count === 3) {
      count = 0;
    }
    return options[count];
  }
}

module.exports = router;
