(function (angular) {
  angular.module('Owler')
    .factory('Containers', ['$resource', 'AppConfig', function ($resource, AppConfig) {
      return $resource('http://:url/containers/:id/:action', {}, {
        query: {
          method: 'GET',
          params: {
            action: 'json'
          },
          isArray: true
        },
        get: {
          method: 'GET',
          params: {
            id: '@id',
            action: 'json'
          }
        },
        start: {
          method: 'POST',
          params: {
            id: '@id',
            action: 'start'
          }
        },
        stop: {
          method: 'POST',
          params: {
            id: '@id',
            action: 'stop'
          }
        },
        stats: {
          method: 'GET',
          params: {
            id: '@id',
            action: 'stats',
            stream: '0'
          }
        },
        top: {
          method: 'GET',
          params: {
            id: '@id',
            action: 'top'
          }
        },
        logs: {
          method: 'GET',
          params: {
            id: '@id',
            action: 'logs',
            follow: 0,
            tail: 10
          },
          transformResponse: function(data, headersGetter, status) {
            return {content: data.replace(/(\[[0-9]*;?[0-9]*m)/g, '').split('\n')};
          }
        }
      });
    }]);
})(angular);
