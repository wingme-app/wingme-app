(function() {

var module = angular.module('wingme.services');

module.factory('Matches', matches);

// --------------------------------------

function matches($http, $state, Auth) {

  var potentialMatches = [];
  var all = [];
  var myMatches = []; 

  return {
    getMatches: getMatches,// get all possible matches
    viewPotentialMatch: viewPotentialMatch,
    confirmMatch: confirmMatch,
    getMyMatches: getMyMatches
  };

  // ------------

  function getMatches(){
    var request = {
      method: 'GET',
      url: 'http://localhost:8000/api/duos/find' //edit duos on url in backend
    };
    
    return $http(Auth.attachToken(request))
      .then(success, error);

    // return currentWings;

    function success(response) {
      // this is what response looks like:
      // push in each match object to potential matches array
      response.data.results.forEach(function(match){
        potentialMatches.push(match);
      });
      return potentialMatches;
      
    }

    function error(response) {
      // TODO: error handling 
      console.log('error in getMatches ', response );
    }
  } //end of getMatches() function

  function viewPotentialMatch(array){
    array.shift();
  }

  function confirmMatch(matchObj){
    console.log('Match Accepted, this is the matchObj post', matchObj);
    var request = {
      method: 'POST',
      url: 'http://localhost:8000/api/duos/find',
      data: matchObj
    };
    
    return $http(Auth.attachToken(request))
      .then(success, error);

    function success(response){
      // console.log('this is the response line 67 sucess, ', response);
    }
    function error(response){
      // console.log('this is the response line 70 error, ', response);
    }
  }

  function getMyMatches(){
    var request = {
      method: 'GET',
      url: 'http://localhost:8000/api/duos/'
    };
    
    return $http(Auth.attachToken(request))
      .then(success, error);

    function success(response) {
      // this is what response looks like:
      console.log('get matches response ', response);
      response.data.results.forEach(function(myMatch){
        myMatches.push(myMatch);
      });
      return myMatches;
      // push in each match object to potential matches array
      // response.data.results.forEach(function(match){
      //   potentialMatches.push(match);
      // });
      // console.log('this is the potential matches array ', potentialMatches);
      // return potentialMatches;
      
    }

    function error(response) {
      // TODO: error handling 
      console.log('error in myMatches ', response );
    }
  }


/*
  function getRandomInt(min, max){
    return Math.floor(Math.random() *  (max - min + 1)) + min;
  }
*/

} 

})(); // end
