(function (angular) {
  angular.module('DMM')
    .factory('Containers', ['$resource', 'AppConfig', function ($resource, AppConfig) {
      return $resource(AppConfig.BASE_URL + '/containers/:id/:action', {}, {
        query: {method: 'GET', params: {action: 'json'}, isArray: true},
        get: {method: 'GET', params: {id: '@id', action: 'json'}},
        stats: {method: 'GET', params: {id: '@id', action: 'stats'}},
        top: {method: 'GET', params: {id: '@id', action: 'top'}}
      });
    }]);
})(angular);
