'use strict';

var MatchCtrl = function($scope, $http) {
  $http.get('api/match')
  .then(function(response) {
    $scope.genres = response.data;
  });
}

module.exports = MatchCtrl;
