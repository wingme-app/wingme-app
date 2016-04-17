(function() {

var module = angular.module('wingme.controllers');

module.controller('MyMatchesCtrl', function(Matches) { //as myMatches
	var vm = this;
	vm.confirmedMatches = [];
	vm.pendingMatches = [];
	vm.myMatchesArray = [];
	Matches.getMatches().then(function(matches) {
		console.log('matches in myMatches tab: ', matches);
	  	vm.pendingMatches = matches.pendingMatches;
	  	vm.myMatchesArray = matches.confirmedMatches;
	}).catch(function(err) {
		console.error('this is an error ', err);
	}); 

});

})(); // end

