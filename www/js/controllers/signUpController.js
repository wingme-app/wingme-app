(function() {

var module = angular.module('wingme.controllers');

module.controller('SignUpCtrl', function(Wings, Auth, $state) {
  
  this.signup = function(username, password) {
    Auth.signup(username, password)
      .then(function(resp) {
        if (resp.data.success) {
          $state.go('tab.addWing');
        } else {
          console.error(resp.data.message);
        }
      });
  }
});

})();