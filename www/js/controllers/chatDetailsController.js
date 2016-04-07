(function() {

var module = angular.module('wingme.controllers');

module.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

})();
