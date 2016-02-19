'use strict';

angular.module('cinePlate.match', [])

.controller('MatchCtrl', function($scope, $http, $routeParams, Matches) {

  $scope.stars = [1, 2, 3, 4, 5];
  $scope.movie = { 
    title: 'Kung Fu Panda',
    rating: 4
  }
  $scope.restaurant = { 
    name: 'Jims BBQ',
    rating: 3
  }

  $scope.data = {}

  $scope.generateMatch = function () {
    Matches.generateMatch()
      .then(function (response) {
        $scope.data.genres = response;
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.generateMatch();

})
