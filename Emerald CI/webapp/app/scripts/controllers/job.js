'use strict';

/**
 * @ngdoc function
 * @name emeraldApp.controller:JobCtrl
 * @description
 * # JobCtrl
 * Controller of the emeraldApp
 */
angular.module('emeraldApp')
  .controller('JobCtrl', ['$scope', '$http', 'project', 'build', 'job', function ($scope, $http, project, build, job) {
      $scope.project = project;
      $scope.build = build;
      $scope.job = job;

      var uri = "ws://" + window.document.location.host + "/api/v1/jobs/" + $scope.job.id + "/logs";
      var ws  = new WebSocket(uri);
      $scope.terminalOutputWebsocket = "";
      $scope.terminalOutputPreload = "";
      ws.onmessage = function(message) {
          if(undefined != message) {
              $scope.terminalOutputWebsocket += JSON.parse(message.data).payload.log;
              $scope.$apply();
          }
      };

      $scope.event_bus.onmessage = function(message) {
          var json = JSON.parse(message.data);
          if(json.event_type == "update" && json.type == "job") {
              if($scope.job.id == json.data.id) {
                  $scope.job = json.data;
                  $scope.$apply();
              }
          }
      };

      $http.get('/api/v1/jobs/' + $scope.job.id + '/log').
        then(function(response) {
                 console.log(response.data);
                 response.data.forEach(function(logLine) {
                     if(undefined != logLine && logLine.length !== 0 && logLine.trim()) {
                         $scope.terminalOutputPreload += logLine;
                     }
                 });
             });
  }]);
