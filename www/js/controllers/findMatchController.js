(function() {

var module = angular.module('wingme.controllers');

module.controller('FindMatchCtrl', function(Matches, $scope) { //as findMatch

	var vm = this;

	vm.potentialMatches;

	vm.displayImg = false;

	Matches.getMatches().then(function(matches) {
		console.log('inside of get matches : ', matches);
	  	vm.displayImg = true;
	  	vm.potentialMatches = matches.potentialMatches;
	}).catch(function(err) {
		console.error(err);
	}); 
	//this will only occur on first click of find match --> add for later clicks later

	vm.nextMatch = Matches.nextMatch;

	// fired when ACCEPT match button click

	vm.confirmMatch = function(duo, accepted){
		Matches.confirmMatch(duo, accepted).then(function(response){
			Matches.nextMatch(vm.potentialMatches);
			console.log('vm potentialMatches = ', vm.potentialMatches);
		});
	};

});

})(); // end

