(function() {

var module = angular.module('wingme.services');

module.factory('Wings', wings);

// --------------------------------------

function wings($http, $state) {

  var currentWings = [];

  return {
    getWings: getWings, // gets all wings from /api/wings/requests
    updateWing: updateWing, // post wing to /api/wings/requests
    addWingPost: addWingPost
  };

  // ------------

  function getWings() {

    var request = {
      method: 'GET',
      url: 'http://localhost:8000/api/wings/requests'
    }

    $http(request)
      .then(success, error)

    return currentWings;

    // -----------------
    // request callbacks

    function success(response) {
      response.data.potentialWings.forEach(function(wing) {
        // we manipulate the current wings variable instead of reassigning the variable.
        // this forces a digest cycle refresh.
        currentWings.push(wing);
        return currentWings;
      });
    }

    function error(response) {
      // TODO: error handling 
    }
  }

  function updateWing(username, index, status) {
    // index is the position inside of the array of wings given to us in the get request.

    var request = {
      method: 'POST',
      url: 'http://localhost:8000/api/wings/requests',
      data: {
        "wing" : username,
        "accepted" : status
      }
    };

    $http(request)
      .then(success, error);

    // -----------------
    // request callbacks

    function success(response) {
      console.log(response);
    }

    function error(response) {
      // TODO: error handling
    }
  }

  function addWingPost(username) {

    var request = {
      method: 'POST',
      url: 'http://localhost:8000/api/wings/add',
      data: {
        wingToAdd: username
      }
    };

     $http(request)
       .then(success, error);

    // -----------------
    // request callbacks

    function success(response) {
      console.log(response);
      $state.go('tab.addWing');
    }

    function error(response) {
      // TODO: error handling
    }
  }
}

})(); // end
