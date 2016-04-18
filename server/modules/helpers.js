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


module.exports = {
  sendJSON: sendJSON,
  Counter: Counter
}
