(function (angular) {
  angular.module('Owler')
    .controller('ConnectionSettingsCtrl', ['$scope', 'AppConfig', '$ionicLoading', 'Docker', function ($scope, AppConfig, $ionicLoading, Docker) {
      $scope.AppConfig = AppConfig;
      $scope.testConnection = function () {
        Docker.version({
          url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT
        }, function () {
          $ionicLoading.show({template: 'Connection succeeded !', noBackdrop: true, duration: 2000});
        }, function () {
          $ionicLoading.show({template: 'Connection failed !', noBackdrop: true, duration: 2000});
        });
      };
    }]);
})(angular);
