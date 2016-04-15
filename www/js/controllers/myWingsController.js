(function() {

var module = angular.module('wingme.controllers');

module.controller('WingRequestsCtrl', function(Wings) {

  var vm = this;

  vm.allWingRequests = [];
  vm.wingRequestsSent = [];
  vm.wingRequestsReceived = [];
  vm.confirmedWings = [];
  



  Wings.getWings()
    .then(function(currentWings) {
      console.log('data from getWings', currentWings);
      // handles wing requests that have been sent
      vm.confirmedWings = currentWings.filter(function(user){
        return user.isWing && !user.pendingWing;
      });
      vm.wingRequestsSent = currentWings.filter(function(user) {
        return !user.isWing && user.pendingWing;
      });
      // handle wing requests that have been received
      vm.wingRequestsReceived = currentWings.filter(function(user){
        return !user.isWing && !user.pendingWing;
      });
      // combination of all wing requests
      vm.allWingRequests = currentWings;
      console.log('this is WRS: ', vm.wingRequestsSent);
      console.log('this is WRR: ', vm.wingRequestsReceived);
      console.log('this is CWs: ', vm.confirmedWings);
    });
 
  vm.updateWing = Wings.updateWing;

  vm.remove = function(chat) {
    Chats.remove(chat);
  };
});

})();
