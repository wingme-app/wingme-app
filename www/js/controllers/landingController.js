(function() {

var module = angular.module('wingme.controllers');

module.controller('LandingCtrl', landingCtrl);

function landingCtrl($state, $scope) {

  var vm = this;

  vm.redirectToSignup = function() {
    $state.go('signup');
  }

  vm.redirectToLogin = function() {
    $state.go('login');
  }
}

})();
