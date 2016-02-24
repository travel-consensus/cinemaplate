'use strict';

angular.module('cinePlate.match', [])

.controller('MatchCtrl', ['$scope', '$http', '$routeParams', 'Matches', function($scope, $http, $routeParams, Matches) {
  $scope.contentLoaded = false;

  $scope.stars = [1, 2, 3, 4, 5];
  $scope.movie = { 
    title: 'Kung Fu Panda',
    rating: 4
  }
  
  // set initial state
  $scope.movieLockImage = './img/unlocked.png'

  // function that toggles lockRestaurant
  $scope.restaurantLock = function () {
    $scope.lockRestaurant = !$scope.lockRestaurant
  }
  // function that toggles lockMovie
  $scope.movieLock = function () {
    $scope.lockMovie = !$scope.lockMovie
    if($scope.lockMovie) {
      $scope.movieLockImage = './img/locked.png'
    } else { $scope.movieLockImage = './img/unlocked.png' }
  }

  $scope.searchZip = $routeParams.zip;
  $scope.restaurant = {};
  $scope.movie = {};
  console.log("$scope",$scope);
  $scope.generateMatch = function () {
    $scope.contentLoaded = false;
    $scope.isActive = !$scope.isActive;
    Matches.generateMatch($routeParams.zip)
      .then(function (response) {
        console.log(response)

        // generate new restaurant unless lockRestaurant is true
        if(!$scope.lockRestaurant) {
          $scope.restaurant = response.restaurant;
          // $scope.lockRestaurant = true;
        }
        
        
        // generate new movie unless lockMovie is true
        if(!$scope.lockMovie) {
          $scope.movie = response.movie;
          console.log("lockMovie", $scope.lockMovie)
          // $scope.lockMovie = true;
        };
        $scope.contentLoaded = true;
        $scope.isActive = !$scope.isActive;
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.generateMatch();

}])
