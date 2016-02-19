'use strict';

angular.module('cinePlate.services', [])

.factory('Matches', ['$http', function ($http) {

  var generateMatch = function (zip) {
    return $http({
      method: 'GET',
      url: '/api/match/' + zip
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  return {
    generateMatch: generateMatch
  };
}])