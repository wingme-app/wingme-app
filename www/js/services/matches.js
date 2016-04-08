(function() {

var module = angular.module('wingme.services');

module.factory('Matches', matches);

// --------------------------------------

function matches($http, $location) {

  var currentWings = [];

  init();

  return {
    get: get, // gets random duo
    addWingPost: addWingPost
  };

  // ------------

  function init() {
    
  }

  // function get() {

  //   $http({
  //     method: 'GET',
  //     url: 'http://localhost:8000/api/duos/find'
  //   }).then(function successCallback(response) {
  //     response.data.potentialWings.forEach(function(wing) {
  //       currentWings.push(wing);
  //     });
  //     return currentWings;
  //   }, function errorCallback(response) {

  //   });

  //   return currentWings;
  // }

} 

})(); // end