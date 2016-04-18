(function() {

var module = angular.module('wingme.controllers');

module.controller('WingRequestsCtrl', function(Wings) {

  var vm = this;

  // data
  vm.allWingRequests = [];
  vm.wingRequestsSent = [];
  vm.wingRequestsReceived = [];
  vm.confirmedWings = [];
  vm.currentWingsSent = [];
  vm.currentWingsReceived = [];
  vm.currentWing = [];

  // methods
  vm.updateWing = Wings.updateWing;
  vm.beCurrentWing = Wings.currentWingReq;
  vm.currentWingResp = Wings.currentWingResp;

  Wings.getWings()
    .then(function(wings) {
      // console.log('data from getWings', wings);
      vm.currentWing = wings.currentWing;

      vm.currentWingsReceived = wings.currentWingsReceived;

      vm.currentWingsSent = wings.currentWingsSent;

      vm.confirmedWings = wings.confirmedWings;

      vm.wingRequestsSent = wings.wingRequestsSent;

      vm.wingRequestsReceived = wings.wingRequestsReceived;
    });

  vm.remove = function(chat) {
    Chats.remove(chat);
  };
});

})();
