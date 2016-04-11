(function() {

var module = angular.module('wingme.controllers');

module.controller('FindMatchCtrl', function(Matches) { //as findMatch

	var vm = this;

	vm.potentialMatches;

	vm.displayImg = false;

	Matches.getMatches()
	  .then(function(matches) {
	  	vm.displayImg = true;
	  	vm.potentialMatches = matches;
	  }); //this will only occur on first click of find match --> add for later clicks later

	// fired when REJECT button clicked
	vm.nextMatch = function() {
		if (vm.potentialMatches.length === 1){
			console.log('length of matches is: ', vm.potentialMatches.length)
			vm.potentialMatches.shift();
			vm.potentialMatches.push({imageURL: 'http://www.gimmesomeoven.com/wp-content/uploads/life/2013/10/Picky-576x576.jpg'});
		}
		else {
			vm.potentialMatches.shift();
		}
	};

	// fired when ACCEPT match button click
	vm.confirmMatch = Matches.confirmMatch;


	// this.matchView = this.potentialMatches.pop();

	// this.imageView = this.matchView.imageURL;

	// this.viewPotentialMatch = Matches.viewPotentialMatch(this.getMatches);


});

})(); // end

