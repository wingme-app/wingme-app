(function() {

var module = angular.module('wingme.controllers');

module.controller('MyMatchesCtrl', function(Matches) { //as myMatches
	var vm = this;
	vm.myMatchesArray = [];
	vm.pendingMatchesArray = [];
	Matches.getMyMatches().then(function(myMatches){
		myMatches.forEach(function(myMatch) {
			if (myMatch.status == "pending"){
				vm.pendingMatchesArray.push(myMatch);
			}
			else if (myMatch.status == "accepted"){
				vm.myMatchesArray.push(myMatch);
			}
		});
	});

});

})(); // end

