'use strict';

var SplashCtrl = function($scope, $http, $location) {
  $scope.zip = '';
  $scope.getZip = function () {
    if($scope.zip){
      console.log($scope.zip)
      $location.path('/match/' + $scope.zip);
    }
  }
};

module.exports = SplashCtrl;
