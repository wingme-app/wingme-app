(function() {

var module = angular.module('wingme.services');

module.factory('Matches', matches);

// --------------------------------------

function matches($http, $state, Auth, Config) {

  var potentialMatches = [];
  var all = [];
  var myMatches = []; 

  var matches = {
    potentialMatches: [],
    pendingMatches: [],
    confirmedMatches: []
  };

  return {
    getMatches: getMatches,// get all possible matches
    viewPotentialMatch: viewPotentialMatch,
    confirmMatch: confirmMatch,
    getMyMatches: getMyMatches,
    nextMatch: nextMatch,
    matches: matches
  };

  // ------------

  function getMatches(){
    var request = {
      method: 'GET',
      url: Config.dev.api + '/pairs' //edit duos on url in backend
    };
    
    return $http(Auth.attachToken(request))
      .then(success, error);

    // return currentWings;

    function success(response) {
      matches.potentialMatches = [];
      matches.pendingMatches = [];
      matches.confirmedMatches = [];
      response.data.results.forEach(function(match){
        if (match.status === 'pendingPair'){
          matches.pendingMatches.push(match);
        }
        else if (match.status === 'isPair'){
          matches.confirmedMatches.push(match);
        }
        else if (match.status === null || match.status === "bePendingPair"){
          matches.potentialMatches.push(match);
        }
        else {
          console.log('in final else, not pair or null. match.status = ', match.status);
        }
      });
      return matches;
      
    }

    function error(response) {
      // TODO: error handling 
      console.log('error in getMatches ', response);
    }
  } //end of getMatches() function

  function viewPotentialMatch(array){
    array.shift();
  }

  function confirmMatch(duo, accepted){
    var request = {
      method: 'POST',
      url: Config.dev.api + '/pairs',
      data: {
        targetDuoID: duo.duoID,
        pairStatus: duo.status,
        accepted: accepted
      }
    };
    
    return $http(Auth.attachToken(request))
      .then(success, error);

    function success(response){
      // console.log('this is the response line 67 sucess, ', response);
      console.log('success in confirmMatch');
      if (accepted && duo.status === 'bePendingPair') {
        duo.status = 'isPair';
        matches.confirmedMatches.push(duo);
      } else if (accepted && duo.status === null) {
        matches.pendingMatches.push(duo);
      }
      console.log('matches.pendingMatches = ', matches.pendingMatches);
      return response.config.data;
    }
    function error(response){
      console.log('error in accept duo: ', response);
      // console.log('this is the response line 70 error, ', response);
    }
  }

  function nextMatch(array){
    if (array.length <= 1){
      array.shift();
      array.push({imageURL: 'http://www.gimmesomeoven.com/wp-content/uploads/life/2013/10/Picky-576x576.jpg'});
    }
    else {
      array.shift();
      console.log('matches.potentialMatches = ', matches.potentialMatches);
    }
  }

  function getMyMatches(){
    var request = {
      method: 'GET',
      url: Config.dev.api + '/pairs/'
    };
    
    return $http(Auth.attachToken(request))
      .then(success, error);

    function success(response) {
      // this is what response looks like:
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
  
} 

})(); // end
