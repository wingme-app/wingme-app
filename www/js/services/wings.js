(function() {

var module = angular.module('wingme.services');

module.factory('Wings', wings);

// --------------------------------------

function wings($http, $state, Config, Auth) {

  var currentWings = [];

  return {
    getWings: getWings, // gets all wings from /api/wings/requests
    updateWing: updateWing, // post wing to /api/wings/requests
    addWingPost: addWingPost,
    currentWingReq: currentWingReq,
    currentWingResp: currentWingResp
  };

  // ------------

  function getWings() {

    var request = {
      method: 'GET',
      url: Config.dev.api + '/wings/wingRequests'
    };

    return $http(Auth.attachToken(request))
      .then(success, error);

    // -----------------
    // request callbacks

    function success(response) {

      console.log('response = ', response);

      var wingTypes = {currentWing: [], currentWingsReceived: [],
        currentWingsSent: [],
        confirmedWings: [],
        wingRequestsSent: [],
        wingRequestsReceived: []
      };

      response.data.results.forEach(function(wing) {
        // we manipulate the current wings variable instead of reassigning the variable.
        // this forces a digest cycle refresh.
        console.log('wing: ', wing);
        if (wing.status === "isCurrentWing"){
          wingTypes.currentWing.push(wing);
        }
        else if (wing.status === "beCurrentWing"){
          wingTypes.currentWingsReceived.push(wing);
        }
        else if (wing.status === "pendingCurrentWing"){
          wingTypes.currentWingsSent.push(wing);
        }
        else if (wing.status === "isWing"){
          wingTypes.confirmedWings.push(wing);
        }
        else if (wing.status === "pendingWing"){
          wingTypes.wingRequestsSent.push(wing);
        }
        else if (wing.status === "bePendingWing"){
          wingTypes.wingRequestsReceived.push(wing);
        }
        else{
          console.log('unfiltered wing: ', wing);
        }
      });

      return wingTypes;
    }

    function error(response) {
      // TODO: error handling 
    }
  }

  function updateWing(userID, status) {
    // index is the position inside of the array of wings given to us in the get request.

    var request = {
      method: 'POST',
      url: Config.dev.api + '/wings/wingRequests',
      data: {
        "targetID" : userID, 
        "accepted" : status
      }
    };

    $http(Auth.attachToken(request))
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

  function currentWingReq(userID, status) {

    var request = {
      method: 'POST',
      url: Config.dev.api + '/wings/addCurrent', //change
      data: {
        "targetID" : userID, 
        "accepted" : status
      }
    };

    $http(Auth.attachToken(request))
      .then(success, error);

    // -----------------
    // request callbacks

    function success(response) {
      console.log('accepted CW req ', response);
    }

    function error(response) {
      // TODO: error handling
    }
  }

  function currentWingResp(userID, status) {

    var request = {
      method: 'POST',
      url: Config.dev.api + '/wings/current', //change
      data: {
        "targetID" : userID, 
        "accepted" : status
      }
    };

    $http(Auth.attachToken(request))
      .then(success, error);

    // -----------------
    // request callbacks

    function success(response) {
      console.log('accepted CW req ', response);
    }

    function error(response) {
      // TODO: error handling
    }
  }

  function addWingPost(username) {

    var request = {
      method: 'POST',
      url: Config.dev.api + '/wings/add',
      data: {
        wingToAdd: username
      }
    };

    $http(Auth.attachToken(request))
     .then(success, error);

    // -----------------
    // request callbacks

    function success(response) {
      console.log(response);
      $state.go('tab.myWings');
    }

    function error(response) {
      // TODO: error handling
    }
  }
}

  

})(); // end
