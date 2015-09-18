(function (angular) {
  angular.module('DMM')
    .factory('Docker', ['$resource', 'AppConfig', function ($resource, AppConfig) {
      return $resource(AppConfig.BASE_URL + '/:action', {}, {
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
