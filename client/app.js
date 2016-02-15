// Require Angular just like we do in Node!
var angular = require('angular');

// We can load up controllers as modules. KAKOW!
var MatchCtrl = require('./controllers/MatchCtrl.js');
var SplashCtrl = require('./controllers/SplashCtrl.js');

// Instantiate our app instance and add ngRoute as a dependecy via
// the 'angular-route' npm module. (ngRoute === angular-route)
var app = angular.module('cinePlate', [require('angular-route')]);

// Angular routing -- Express handles serving the index.html file
// and we use Angular's $routeProvider via ngRoute to match urls
// with templates and their corresponding controllers.
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider

  // The /match route is where the results of a zip code
  // lookup are loaded.
  .when('/match', {
    templateUrl: 'matcher.html',
    controller: 'MatchCtrl'
  })

  // Load up the splash page so user can enter their zip.
  .when('/', {
    templateUrl: 'splash.html',
    controller: 'SplashCtrl'
  })
  
  // Finally, a catchall route in case the path was not found above.
  .otherwise({
    redirectTo: '/'
  });
 }]);

// Add the $http dependency so we can make a call to the express
// api routes declared in server/index.js
app.controller('MatchCtrl', ['$scope', '$http', MatchCtrl]);
app.controller('SplashCtrl', ['$scope', SplashCtrl]);
