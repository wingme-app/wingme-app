(function() {

var module = angular.module('wingme.controllers');

module.controller('FindMatchCtrl', function(Matches) { //as findMatch

	var vm = this;

	vm.potentialMatches;

	vm.displayImg = false;

	Matches.getMatches()
	  .then(function(matches) {
	  	console.log('this is in matches promise, and matches = ', matches);
	  	vm.displayImg = true;
	  	vm.potentialMatches = matches;
	  	console.log(vm.potentialMatches)
	  }); //this will only occur on first click of find match --> add for later clicks later

	// Matches.viewPotentialMatch(vm.potentialMatches)

	vm.nextMatch = function() {
		if (vm.potentialMatches.length === 0){
			vm.potentialMatches.push({imageURL: 'http://www.gimmesomeoven.com/wp-content/uploads/life/2013/10/Picky-576x576.jpg'});
		}
		else {
			vm.potentialMatches.shift();
		}
		// return Matches.viewPotentialMatch(array);
	};
	// this.matchView = this.potentialMatches.pop();

	// this.imageView = this.matchView.imageURL;

	// this.viewPotentialMatch = Matches.viewPotentialMatch(this.getMatches);


});

})(); // end

