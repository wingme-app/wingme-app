(function() {

var module = angular.module('wingme.controllers');

module.controller('SignUpCtrl', function(Auth, $state, $rootScope) {
  
  this.signup = function(username, password) {
    Auth.signup(username, password)
      .then(function(resp) {
        if (resp.data.success) {
          $state.go('tab.addWing');
          $rootScope.$broadcast('loggedIn');
        } else {
          console.error(resp.data.message);
        }
      });
  }
});

})();
