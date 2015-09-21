'use strict';

/**
 * @ngdoc function
 * @name emeraldApp.controller:BuildsCtrl
 * @description
 * # BuildsCtrl
 * Controller of the emeraldApp
 */
angular.module('emeraldApp')
  .controller('BuildsCtrl', ['$scope', '$http', 'api', 'project', function ($scope, $http, api, project) {
      $scope.project = project;

      api.builds($scope.project.id).
        then(function(response) {
            $scope.builds = response;
        });

      $scope.event_bus.onmessage = function(message) {
          var json = JSON.parse(message.data);
          if(json.event_type == "new" && json.type == "build") {
              $scope.builds.unshift(json.data);
              $scope.$apply();
          }
          if(json.event_type == "update" && json.type == "job") {
              $scope.builds.forEach(function(build) {
                  if(build.id == json.data.build_id) {
                      build.latest_job = json.data;
                      $scope.$apply();
                  }
              });
          }
      };

      $scope.manuallyTriggerBuild = function() {
          api.triggerBuild($scope.project.id);
      };
  }]);
