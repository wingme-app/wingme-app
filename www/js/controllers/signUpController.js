(function() {

var module = angular.module('wingme.controllers');

module.controller('SignUpCtrl', function(Auth, $state, $rootScope) {
  
  var vm = this;

  vm.error = false;
  vm.message;

  vm.signup = function(username, password) {
    Auth.signup(username, password)
      .then(function(resp) {
        if (resp.data.success) {
          $state.go('tab.addWing');
          $rootScope.$broadcast('loggedIn');
        } else {
          vm.error = true;
          vm.message = resp.data.message;
        }
      });
  }
});

})();
