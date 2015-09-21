'use strict';

/**
 * @ngdoc service
 * @name emeraldApp.api
 * @description
 * # api
 * Service in the emeraldApp.
 */
angular.module('emeraldApp')
  .service('api', ['$q', '$http', function ($q, $http) {
      var apiCallPost = function(resource, data) {
          var deferred = $q.defer();
          $http.post(resource).
            then(function(response, data) {
                console.log(response);
                return deferred.resolve(response.data);
            }, function(response){
                return deferred.reject();
            });
          return deferred.promise;
      };

      var apiCallGet = function(resource) {
          var deferred = $q.defer();
          $http.get(resource).
            then(function(response) {
                console.log(response);
                return deferred.resolve(response.data);
            }, function(response){
                return deferred.reject();
            });
          return deferred.promise;
      };

      return {
        githubRepos: function() {
            return apiCallGet('/api/v1/github/repos');
        },
        syncRepos: function() {
            return apiCallPost('/api/v1/github/repos/sync');
        },
        addGithubRepo: function(githubRepoId) {
            return apiCallPost('/api/v1/github/repos/' + githubRepoId);
        },
        projects: function() {
            return apiCallGet('/api/v1/projects');
        },
        project: function(projectId) {
            return apiCallGet('/api/v1/projects/' + projectId);
        },
        builds: function(projectId) {
            return apiCallGet('/api/v1/projects/' + projectId + '/builds');
        },
        build: function(buildId) {
            return apiCallGet('/api/v1/builds/' + buildId);
        },
        triggerBuild: function(projectId) {
            return apiCallPost('/api/v1/projects/' + projectId + '/builds/trigger/manual');
        },
        jobs: function(buildId) {
            return apiCallGet('/api/v1/builds/' + buildId + '/jobs');
        },
        job: function(jobId) {
            return apiCallGet('/api/v1/jobs/' + jobId);
        }
      }
  }]);
