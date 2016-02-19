'use strict';

angular.module('cinePlate.services', [])

.factory('Matches', function ($http) {

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
})