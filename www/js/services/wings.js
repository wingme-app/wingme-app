(function() {

var module = angular.module('wingme.services');

module.factory('Wings', wings);

// --------------------------------------

function wings($http, $location) {

  var currentWings = [];

  init();

  return {
    get: get, // gets all wings from /api/wings/requests
    post: post, // post wing to /api/wings/requests
    addWingPost: addWingPost
  };

  // ------------

  function init() {
    
  }

  function get() {

    $http({
      method: 'GET',
      url: 'http://localhost:8000/api/wings/requests'
    }).then(function successCallback(response) {
      response.data.potentialWings.forEach(function(wing) {
        currentWings.push(wing);
      });
      return currentWings;
    }, function errorCallback(response) {

    });

    return currentWings;
  }

  function post(username, index, status) {
    // index is the position inside of the array of wings given to us in the get request.

    $http({
      method: 'POST',
      url: 'http://localhost:8000/api/wings/requests',
      data: {
        "wing" : username,
        "accepted" : status
      }
    });

  }

  function addWingPost(username) {
     $http({
      method: 'POST',
      url: 'http://localhost:8000/api/wings/add',
      data: {
        wingToAdd: username
      }
    }).then(function successCallback(response) {
      console.log('this is response, line 61: ', response);
      $location.path('/myWings');
    }, function errorCallback(response) {
      console.log('inside error, line 64');
    });
  }
}

})(); // end
