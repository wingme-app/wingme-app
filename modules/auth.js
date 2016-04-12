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

// middleware function for checking auth
var ifAuthorized = module.exports.ifAuthorized = function(req, res, next) {
  var token = req.headers['x-access-token'];
  var verify;

  if (token) {
    jwt.verify(token, tokenSecret, function(err, decoded) {
      if (err) {
        unauthorized(res);
      } else {
        next();
      }
    })
  } else {
    unauthorized(res);
  }

  function unauthorized(res) {
    res.json({
      success: false,
      message: 'Your account is unauthorized (token missing or invalid.)'
    })
  }
}
