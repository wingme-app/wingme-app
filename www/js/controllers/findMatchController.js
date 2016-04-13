(function() {

var module = angular.module('wingme.controllers');

module.controller('FindMatchCtrl', function(Matches) { //as findMatch

	var vm = this;

	vm.potentialMatches;

	vm.displayImg = false;

	Matches.getMatches().then(function(matches) {
	  	vm.displayImg = true;
	  	vm.potentialMatches = matches;
	}); 
	//this will only occur on first click of find match --> add for later clicks later

	vm.nextMatch = Matches.nextMatch;

	// fired when ACCEPT match button click

	vm.confirmMatch = function(obj){
		Matches.confirmMatch(obj).then(function(response){
			console.log('then resp', response);
			Matches.nextMatch(vm.potentialMatches);
		});
	};

});



})(); // end

