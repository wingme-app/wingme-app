(function() {

var app = angular.module('wingme', ['ionic', 'wingme.config', 'wingme.authentication', 'wingme.controllers', 'wingme.services']);

app.run(run);
app.config(routes);

// register dependencies
angular.module('wingme.config', []);
angular.module('wingme.authentication', []);
angular.module('wingme.controllers', []);
angular.module('wingme.services', []);

// --------------------------------------
// --------------------------------------

function run($ionicPlatform, $rootScope, Auth) {
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

function routes($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/page-signup.html',
    controller: 'SignUpCtrl'
  })

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
