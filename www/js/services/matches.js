(function() {

var module = angular.module('wingme.services');

module.factory('Matches', matches);

// --------------------------------------

function matches($http, $state) {

  var potentialMatches = [];
  var all = [];

  return {
    getMatches: getMatches,// get all possible matches
    viewPotentialMatch: viewPotentialMatch,
  };

  // ------------

  function getMatches(){
    var request = {
      method: 'GET',
      url: 'http://localhost:8000/api/duos/find' //edit duos on url in backend
    };
    
    return $http(request)
      .then(success, error);

    // return currentWings;

    function success(response) {
      // this is what response looks like:
      console.log('get matches response ', response);
      // push in each match object to potential matches array
      response.data.results.forEach(function(match){
        potentialMatches.push(match);
      });
      console.log('this is the potential matches array ', potentialMatches);
      return potentialMatches;
      
    }

    function error(response) {
      // TODO: error handling 
      console.log('error in getMatches ', response );
    }

  }

  function viewPotentialMatch(array){
    return array.pop();
  }

  // function getRandomInt(min, max){
  //   return Math.floor(Math.random() *  (max - min + 1)) + min;
  // }



} 

})(); // end