(function() {

var module = angular.module('wingme.controllers');

module.controller('AddWingCtrl', function(Wings) {
	var vm = this;
	vm.submit = function(username){
		Wings.addWingPost(username);
	};

});

})();
