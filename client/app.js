// Require Angular just like we do in Node!
var angular = require('angular');

// We can use MatchCtrl.js as a module. KAKOW!
var MatchCtrl = require('./controllers/MatchCtrl.js');

var app = angular.module('cinePlate', []);
app.controller('MatchCtrl', ['$scope', '$http', MatchCtrl]);
