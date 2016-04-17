(function() {

var module = angular.module('wingme.controllers');

module.controller('SignUpCtrl', function(Auth, $state, $rootScope) {
  
  var vm = this;

  vm.error = false;
  vm.message;

  vm.signup = function(username, email, firstname, lastname, password) {
    var userObj = {
      username: username,
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: password
    }

    Auth.signup(userObj)
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
