'use strict';

var MatchCtrl = function($scope, $http, $routeParams) {

  $http.get('api/match/' + $routeParams.zip)
  .then(function(response) {
    console.log(response.data)
    $scope.genres = response.data;
  });
  
}

module.exports = MatchCtrl;
