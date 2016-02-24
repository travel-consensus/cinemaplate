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

.directive('ddTextCollapse', ['$compile', function($compile) {

    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attrs) {

            // start collapsed
            scope.collapsed = false;

            // create the function to toggle the collapse
            scope.toggle = function() {
                scope.collapsed = !scope.collapsed;
            };

            // wait for changes on the text
            attrs.$observe('ddTextCollapseText', function(text) {

                // get the length from the attributes
                var maxLength = scope.$eval(attrs.ddTextCollapseMaxLength);

                if (text.length > maxLength) {
                    // split the text in two parts, the first always showing
                    var firstPart = String(text).substring(0, maxLength);
                    var secondPart = String(text).substring(maxLength, text.length);

                    // create some new html elements to hold the separate info
                    var firstSpan = $compile('<span>' + firstPart + '</span>')(scope);
                    var secondSpan = $compile('<span ng-if="collapsed">' + secondPart + '</span>')(scope);
                    var moreIndicatorSpan = $compile('<span ng-if="!collapsed">... </span>')(scope);
                    var lineBreak = $compile('<br ng-if="collapsed">')(scope);
                    var toggleButton = $compile('<span class="collapse-text-toggle" ng-click="toggle()">{{collapsed ? "less" : "Click for more"}}</span>')(scope);

                    // remove the current contents of the element
                    // and add the new ones we created
                    element.empty();
                    element.append(firstSpan);
                    element.append(secondSpan);
                    element.append(moreIndicatorSpan);
                    element.append(lineBreak);
                    element.append(toggleButton);
                }
                else {
                    element.empty();
                    element.append(text);
                }
            });
        }
    };
}]);


