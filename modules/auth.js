// var jwt = require('jsonwebtoken');

var tokenSecret = 'CouchBase35';
var decode = module.exports.decode = function(token) {
  return jwt.decode(token);
}

var genToken = module.exports.genToken = function(userObj) {
  return jwt.sign({ID: userObj.ID, username: userObj.username}, tokenSecret, {
    expiresIn: 47700
  });
}
