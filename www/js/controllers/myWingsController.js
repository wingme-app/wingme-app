(function() {

var module = angular.module('wingme.controllers');

module.controller('WingRequestsCtrl', function(Wings) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // we call this function (Wings.getWings) to trigger a digest cycle,
  // since it will need to rerender our ng-repeat.
  this.wings = Wings.getWings();
 
  this.updateWing = Wings.updateWing;

  this.remove = function(chat) {
    Chats.remove(chat);
  };
});

})();
