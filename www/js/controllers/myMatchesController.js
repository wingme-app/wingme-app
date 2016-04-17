(function() {

var module = angular.module('wingme.controllers');

module.controller('MyMatchesCtrl', function(Matches) { //as myMatches
	var vm = this;
	vm.myMatchesArray = [];
	vm.pendingMatches = [];
	Matches.getMatches().then(function(matches) {
		console.log('matches in myMatches tab: ', matches);
	  	vm.pendingMatches = matches.pendingMatches;
	}).catch(function(err) {
		console.error(err);
	}); 

});

})(); // end

