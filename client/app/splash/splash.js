'use strict';

angular.module('cinePlate.splash', ["ngAutocomplete"])

.controller('SplashCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.zip = '';
  $scope.getZip = function (dropdown) {
	  var limit_5 = Number($scope.zip.match(/\b\d{5}\b/g))
    
    if(limit_5){
      $location.path('/' + limit_5);
      $scope.$apply()
    } else {
    	console.log('no redirect; $scope.zip:', $scope.zip);
    }
	}
}])
