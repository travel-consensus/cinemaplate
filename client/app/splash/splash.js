'use strict';

angular.module('cinePlate.splash', [])

.controller('SplashCtrl', function($scope, $http, $location) {

  $scope.onlyNumbers = /^[0-9]+$/;

  $scope.zip = '';
  $scope.getZip = function () {
    if($scope.zip){
      console.log($scope.zip)
      $location.path('/match/' + $scope.zip);
    }
  }
})
