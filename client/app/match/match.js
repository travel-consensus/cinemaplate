'use strict';

angular.module('cinePlate.match', [])

.controller('MatchCtrl', ['$scope', '$http', '$routeParams', 'Matches', function($scope, $http, $routeParams, Matches) {

  $scope.stars = [1, 2, 3, 4, 5];
  $scope.movie = { 
    title: 'Kung Fu Panda',
    rating: 4
  }

  $scope.restaurant = {}

  $scope.generateMatch = function () {
    Matches.generateMatch($routeParams.zip)
      .then(function (response) {
        console.log(response)
        $scope.restaurant = response[0];
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.generateMatch();

}])
