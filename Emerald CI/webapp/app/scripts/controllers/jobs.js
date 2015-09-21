'use strict';

/**
 * @ngdoc function
 * @name emeraldApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the emeraldApp
 */
angular.module('emeraldApp')
  .controller('JobsCtrl', ['$scope', 'api', 'project', 'build', function ($scope, api, project, build) {
      $scope.project = project;
      $scope.build = build;

      api.jobs($scope.project.id, $scope.build.id)
        .then(function(response) {
            $scope.jobs = response;
        });

      $scope.event_bus.onmessage = function(message) {
          var json = JSON.parse(message.data);
          if(json.event_type == "new" && json.type == "job") {
              if($scope.build.id == json.data.build_id) {
                  $scope.jobs.unshift(json.data);
                  $scope.$apply();
              }
          }
          if(json.event_type == "update" && json.type == "job") {
              $scope.jobs.forEach(function(job) {
                  if(job.id == json.data.id) {
                      job.state = json.data.state;
                      $scope.$apply();
                  }
              });
          }
      };
  }]);
