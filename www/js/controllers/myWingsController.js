(function() {

var module = angular.module('wingme.controllers');

module.controller('WingRequestsCtrl', function(Wings) {

  var vm = this;

  vm.wings = [];
  vm.wingRequests = [];

  Wings.getWings()
    .then(function(currentWings) {
      vm.wingRequests = currentWings.filter(function(user) {
        return !user.isWing;
      });
      vm.wings = currentWings.filter(function(user) {
        if (user.currentWing) {
          vm.currentWing = user.username;
        }
        return user.isWing;
      });
      console.log(vm.currentWing);
    });
 
  vm.updateWing = Wings.updateWing;

  vm.remove = function(chat) {
    Chats.remove(chat);
  };
});

})();
