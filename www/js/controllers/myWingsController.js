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
    .then(function(currentWings) {
      console.log('data from getWings', currentWings);
      // handles current wing
      vm.currentWing = currentWings.filter(function(user){
        return user.status === "isCurrentWing";
      });

      // handles current wings received
      vm.currentWingsReceived = currentWings.filter(function(user){
        return user.status === "beCurrentWing";
      });

      // handles Current Wings Sent
      vm.currentWingsSent = currentWings.filter(function(user){
        return user.status === "pendingCurrentWing";
      });

      // handles confirmed wing requests
      vm.confirmedWings = currentWings.filter(function(user){
        return user.status === "isWing";
      });
      // handles wing requests that have been sent      
      vm.wingRequestsSent = currentWings.filter(function(user) {
        return user.status === "pendingWing";
      });
      // handle wing requests that have been received
      vm.wingRequestsReceived = currentWings.filter(function(user){
        return user.status === "bePendingWing";
      });

      vm.currentWingReq = currentWings.filter(function(user){
        return user.status === "bePendingWing";
      });
      // combination of all wing requests
      vm.allWingRequests = currentWings;
      console.log('CWs Sent: ', vm.currentWingsSent);
      console.log('CWs Received: ', vm.currentWingsReceived);
    });

  vm.remove = function(chat) {
    Chats.remove(chat);
  };
});

})();
