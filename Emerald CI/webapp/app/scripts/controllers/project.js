'use strict';

/**
 * @ngdoc function
 * @name emeraldApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the emeraldApp
 */
angular.module('emeraldApp')
  .controller('ProjectCtrl', ['$scope', 'project', function ($scope, api) {
      $scope.project = project;
  }]);
