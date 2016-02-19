'use strict';

angular.module('cinePlate.services', [])

.factory('Matches', ['$http', '$location', function ($http, $location) {

  var generateMatch = function (zip) {
    return $http({
      method: 'GET',
      url: '/api/match/' + zip
    })
    .then(function (resp) {
      return resp.data;
    })
    .catch(function (err){
      $location.path('/500');
      return
    });
  };

  return {
    generateMatch: generateMatch
  };
}])