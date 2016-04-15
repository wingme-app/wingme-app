/**
 *  An http response sender helper function
 *
 */
 function sendJSON(res, success, message, results) {
  var response = {
    success: success,
    message: message
  }

  if (results) {
    response.results = results;
  }

  res.json(response);
}

/**
 *  A simple eventing counter to help manage asyncrhonous calls.
 *
 */
function Counter() {
  this.count = 0;
  this.limit = 100; // default limit of 100, change if need be.
  this.cb;
}

Counter.prototype.plus = function() {
  this.count++;
  if (this.count >= this.limit) {
    this.cb();
  }
}

Counter.prototype.go = function() {
  this.cb();
}

Counter.prototype.on = function(limit, cb) {
  this.limit = limit;
  this.cb = cb;
};

/**
 *  Generate a 'real' status: something that reveals who gave consent first in a pending relationship.
 *
 */
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

/**
 *  Filter out the current user from a duo.
 *
 */
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


module.exports = {
  sendJSON: sendJSON,
  Counter: Counter,
  realStatus: realStatus,
  filterDuo: filterDuo
}
