(function() {

var module = angular.module('wingme.controllers');

module.controller('AddWingCtrl', function(Wings) {

	this.submit = function(username){
		Wings.addWingPost(username);
	};

});

})();
