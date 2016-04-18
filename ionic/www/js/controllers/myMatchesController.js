(function() {

var module = angular.module('wingme.controllers');

module.controller('MyMatchesCtrl', function(Matches) { //as myMatches
	var vm = this;

	console.log('hi');
	
	Matches.getMatches().then(function() {
		console.log('matches in myMatches tab: ', Matches.matches);
	  	vm.pendingMatches = Matches.matches.pendingMatches;
	  	vm.myMatchesArray = Matches.matches.confirmedMatches;

	  	console.log('pendingMatches = ', Matches.matches.pendingMatches);
	}).catch(function(err) {
		console.error('this is an error ', err);
	}); 

});

})(); // end

