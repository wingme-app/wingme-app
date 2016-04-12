(function() {

var module = angular.module('wingme.controllers');

module.controller('NavCtrl', navCtrl);

function navCtrl(Auth, $state, $scope) {

  var vm = this;

  vm.authed = Auth.isAuthed();

  vm.logout = function() {
    Auth.logout();
    $state.go('login');
  }

  // listeners

  $scope.$on('loggedOut', function() {
    vm.authed = false;
  });

  $scope.$on('loggedIn', function() {
    vm.authed = true;
  })
}

})();
