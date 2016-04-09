(function() {

var module = angular.module('wingme.config');

module.factory('Config', config);

function config() {
  // the config factory will be used to store environment variables.
  // useful for quickly swapping out dummy API urls and live server urls, etc.
  var dev = {
    api: 'http://localhost:8000/api'
  };

  var deploy = {

  };

  var env = {
    dev: dev,
    deploy: deploy
  };

  return env;
}

})(); // end
