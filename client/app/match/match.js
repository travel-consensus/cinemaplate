'use strict';

angular.module('cinePlate.match', [])

.controller('MatchCtrl', ['$scope', '$http', '$routeParams', 'Matches', function($scope, $http, $routeParams, Matches) {
  $scope.contentLoaded = false;

  $scope.stars = [1, 2, 3, 4, 5];
  $scope.movie = { 
    title: 'Kung Fu Panda',
    rating: 4
  }

  $scope.searchZip = $routeParams.zip;
  $scope.restaurant = {};
  $scope.movie = {};

  $scope.generateMatch = function () {
    $scope.contentLoaded = false;
    $scope.isActive = !$scope.isActive;
    Matches.generateMatch($routeParams.zip)
      .then(function (response) {
        console.log(response)
        $scope.restaurant = response.restaurant;
        $scope.movie = response.movie;
        $scope.contentLoaded = true;
        $scope.isActive = !$scope.isActive;
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.generateMatch();

}])
