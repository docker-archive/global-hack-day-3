'use strict';

/**
 * @ngdoc function
 * @name emeraldApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the emeraldApp
 */
angular.module('emeraldApp')
  .controller('ProjectsCtrl', ['$scope', 'api', 'projects', function ($scope, api, projects) {
      $scope.projects = projects;

      $scope.event_bus.onmessage = function(message) {
          var json = JSON.parse(message.data);
          if(json.event_type == "new" && json.type == "build") {
              $scope.projects.forEach(function(project) {
                  if(project.id == json.data.project_id) {
                      project.latest_build = json.data;
                      $scope.$apply();
                  }
              });
          }
          if(json.event_type == "new" && json.type == "job") {
              $scope.projects.forEach(function(project) {
                  if(project.id == json.data.project_id && project.latest_build.id == json.data.build_id) {
                      project.latest_build.latest_job = json.data;
                      $scope.$apply();
                  }
              });
          }
          if(json.event_type == "update" && json.type == "job") {
              $scope.projects.forEach(function(project) {
                  if(project.id == json.data.project_id && project.latest_build.id == json.data.build_id) {
                      project.latest_build.latest_job = json.data;
                      $scope.$apply();
                  }
              });
          }
      };
  }]);
