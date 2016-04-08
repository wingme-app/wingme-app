(function() {

var app = angular.module('wingme', ['ionic', 'wingme.authentication', 'wingme.controllers', 'wingme.services']);

app.run(run);
app.config(config);

// register dependencies
angular.module('wingme.authentication', []);
angular.module('wingme.controllers', []);
angular.module('wingme.services', []);

// --------------------------------------
// --------------------------------------

function run($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}

function config($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.addWing', {
    url: '/addWing',
    views: {
      'tab-addWing': {
        templateUrl: 'templates/tab-addWing.html',
        controller: 'AddWingCtrl as addWing'
      }
    }
  })

  .state('tab.myWings', { // my wings
      url: '/myWings',
      views: {
        'tab-myWings': {
          templateUrl: 'templates/tab-myWings.html',
          controller: 'WingRequestsCtrl as myWings'
        }
      }
    })

  .state('tab.findMatch', {
    url: '/findMatch',
    views: {
      'tab-findMatch': {
        templateUrl: 'templates/tab-findMatch.html',
        controller: 'FindMatchCtrl as findMatch'
      }
    }
  });

  // .state('tab.findMatch', {
  //   url: '/findMatch',
  //   views: {
  //     'tab-account': {
  //       templateUrl: 'templates/tab-findMatch.html',
  //       controller: 'FidMatchCtrl as findMatch'
  //     }
  //   }
  // });

  // if none of the above states are matched, use this as the fallback
  // EDIT THIS
  $urlRouterProvider.otherwise('/tab/addWing');

}

})(); // end
