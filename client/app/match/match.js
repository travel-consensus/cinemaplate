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
  $scope.restaurantLockImage = './img/unlocked.png'
  $scope.movieLockImage = './img/unlocked.png'

  // function that toggles lockRestaurant
  $scope.restaurantLock = function () {
    $scope.lockRestaurant = !$scope.lockRestaurant
    if($scope.lockRestaurant) {
      $scope.restaurantLockImage = './img/locked.png'
    } else { $scope.restaurantLockImage = './img/unlocked.png' }
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

  $scope.generateMatch = function () {
    $scope.contentLoaded = false;
    $scope.isActive = !$scope.isActive;
    Matches.generateMatch($routeParams.zip)
      .then(function (response) {
        console.log(response)

        // generate new restaurant unless lockRestaurant is true
        if(!$scope.lockRestaurant) {
          $scope.restaurant = response.restaurant;
        }
        
        // generate new movie unless lockMovie is true
        if(!$scope.lockMovie) {
          $scope.movie = response.movie;
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
