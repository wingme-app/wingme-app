(function() {

var module = angular.module('wingme.authentication');

module.factory('Auth', auth);

// --------------------------------------

function auth($http, $state) {

  return {
    login: login,
    logout: logout,
    isAuthed: isAuthed
  }

  // ------------

  function login(username, password) {
    // debugging
    console.log('username submitted = ', username);
    console.log('password submitted = ', password);

    var request = {
      method: 'POST',
      url: '/api/login',
      data: {
        username: username,
        password: password
      }
    };

    $http(request)
      .then(success, error);

    // we can expect an encoded token string from our server.
    function success(resp) {
      saveToken(resp);
    }

    function error(err) {
      console.error(err);
    }
  }

  // to logout, we remove the jwtToken from localStorage
  function logout() {
    $window.localStorage.removeItem('jwtToken');
  }

  // save the token to local storage for persistency
  function saveToken(token) {
    $window.localStorage['jwtToken'] = token;
  }

  function getToken() {
    return $window.localStorage['jwtToken'];
  }

  function isAuthed() {
    var token = getToken();
    if (token) {
      var params = parseJwt(token);
      return Math.round(new Date().getTime() / 1000) <= params.exp;
    } else {
      return false;
    }
  }

  // attach token to request headers & return modified request
  // this function is used in ui-router and other services when necessary.
  function attachToken(request) {
    var token = getToken();
    if (token) {
      request.headers['x-access-token'] = token;
    }
    return token;
  }

  // parse the token (decode) for later use
  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  }
}

})(); // end
