'use strict';

var MatchCtrl = function($scope, $http, $routeParams) {
  $scope.stars = [1, 2, 3, 4, 5];
  $scope.movie = { 
    title: 'Kung Fu Panda',
    rating: 4
  }
  $scope.restaurant = { 
    name: 'Jims BBQ',
    rating: 3
  }

  $http.get('api/match/' + $routeParams.zip)
  .then(function(response) {
    console.log(response.data)
    $scope.genres = response.data;
  });
  
}

module.exports = MatchCtrl;
