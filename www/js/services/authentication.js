(function() {

var module = angular.module('wingme.authentication');

module.factory('Auth', auth);

// --------------------------------------

function auth($http, $window, $state, $rootScope, Config) {

  return {
    signup: signup,
    login: login,
    logout: logout,
    isAuthed: isAuthed
  }

  // ------------

  function signup(username, password) {
    var request = {
      method: 'POST',
      url: Config.dev.api + '/signup',
      data: {
        username: username,
        password: password
      }
    };

    // we return a promise here so that the controller retains async control.
    return $http(request)
      .then(success, error);

    // we can expect an encoded token string from our server.
    function success(resp) {
      if (resp.data.token) {
        saveToken(resp.data.token);
      }
      return resp;
    }

    function error(err) {
      return console.error(err);
    }
  }

  function login(username, password) {
    var request = {
      method: 'POST',
      url: Config.dev.api + '/login',
      data: {
        username: username,
        password: password
      }
    };

    return $http(request)
      .then(success, error);

    // we can expect an encoded token string from our server.
    function success(resp) {
      if (resp.data.token) {
        saveToken(resp.data.token);
      }
      return resp;
    }

    function error(err) {
      return console.error(err);
    }
  }

  // to logout, we remove the jwtToken from localStorage
  function logout() {
    $window.localStorage.removeItem('jwtToken');
    delete $window.localStorage['jwtToken'];
    $rootScope.$broadcast('loggedOut');
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
      console.error('no token found!');
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

  // parse the token (decode) to detect the expiration. (used in isAuthed())
  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  }
}

})(); // end
