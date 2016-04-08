(function() {

var module = angular.module('wingme.authentication');

module.factory('Auth', auth);

// --------------------------------------

function auth() {

  return {
    login: login,
    logout: logout
  }

  // ------------

  function login() {
    
  }

  function logout() {
    
  }
}

})(); // end
