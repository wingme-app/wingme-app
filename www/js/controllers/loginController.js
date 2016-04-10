(function() {

var module = angular.module('wingme.controllers');

module.controller('LoginCtrl', function(Wings, Auth, $state) {

  var vm = this;
  
  vm.status = false;
  vm.message;

  vm.login = function(username, password) {
    Auth.login(username, password)
      .then(function(resp) {
        if (resp.data.success) {
          $state.go('tab.addWing');
        } else {
          vm.status = true;
          vm.message = resp.data.message;
          console.error(resp.data.message);
        }
      })
  }

  vm.redirectToSignup = function() {
    $state.go('signup');
  }

});

})();
