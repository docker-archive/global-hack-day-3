(function (angular) {
  angular.module('Owler')
    .factory('Docker', ['$resource', 'AppConfig', function ($resource, AppConfig) {
      return $resource('http://:url/:action', {}, {
        version: {
          method: 'GET',
          params: {
            action: 'version'
          },
          isArray: false
        },
        info: {
          method: 'GET',
          params: {
            action: 'info'
          },
          isArray: false
        }
      });
    }]);
})(angular);
