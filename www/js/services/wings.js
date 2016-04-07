(function() {

var module = angular.module('wingme.services');

module.factory('Wings', wings);

// --------------------------------------

function wings($http) {

  var currentWings = [];

  init();

  return {
    get: get, // gets all wings from /api/wings/requests
    post: post // post wing to /api/wings/requests
  }

  // ------------

  function init() {
    
  }

  function get() {

    $http({
      method: 'GET',
      url: 'http://localhost:5000/api/wings/requests'
    }).then(function successCallback(response) {
      response.data.potentialWings.forEach(function(wing) {
        currentWings.push(wing);
      });
      return currentWings;
    }, function errorCallback(response) {

    });

    return currentWings;
  }

  function post(status) {
    // status = boolean
    // make some async call to api with post request
    // {
    //   "wing" : "WINGNAME"
    //   "accepted" : true/false
    // }
    $http()

  }
}

})(); // end
