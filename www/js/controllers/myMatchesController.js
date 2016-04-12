(function() {

var module = angular.module('wingme.controllers');

module.controller('MyMatchesCtrl', function(Matches) { //as myMatches
	var vm = this;
	vm.myMatchesArray = [];
	vm.pendingMatchesArray = [];
	Matches.getMyMatches().then(function(myMatches){
		console.log(myMatches);
		myMatches.forEach(function(myMatch)
			{
				if (myMatch.status == "pending"){
					console.log('in pending,', myMatch);
				vm.pendingMatchesArray.push(myMatch);
				console.log(vm.pendingMatchesArray);
			}
			else if (myMatch.status == "accepted"){
				console.log('in accepted', myMatch);
				vm.myMatchesArray.push(myMatch);
			}
		});
	});

});

})(); // end

