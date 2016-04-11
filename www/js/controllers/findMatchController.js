(function() {

var module = angular.module('wingme.controllers');

module.controller('FindMatchCtrl', function(Matches) { //as findMatch

	var vm = this;

	vm.potentialMatches;


	Matches.getMatches()
	  .then(function(matches) {
	  	console.log('this is in matches promise, and matches = ', matches);
	  	vm.potentialMatches = matches;
	  }); //this will only occur on first click of find match --> add for later clicks later


	// this.matchView = this.potentialMatches.pop();

	// this.imageView = this.matchView.imageURL;

	// this.viewPotentialMatch = Matches.viewPotentialMatch(this.getMatches);


});

})(); // end

