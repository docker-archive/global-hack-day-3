(function (angular) {
  angular.module('Owler')
    .controller('DashCtrl', ['$scope', 'Docker', '$ionicHistory', 'AppConfig', '$ionicLoading', function ($scope, Docker, $ionicHistory, AppConfig, $ionicLoading) {
      Docker.version({
        url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT
      }, function (data) {
        $scope.version = data;
      }, function () {
        $ionicLoading.show({
          template: 'Connection failed ! Please verify your connection settings !',
          noBackdrop: true,
          duration: 2000
        });
      });
      Docker.info({
        url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT
      }, function (data) {
        $scope.info = data;
      }, function () {
        $ionicLoading.show({
          template: 'Connection failed ! Please verify your connection settings !',
          noBackdrop: true,
          duration: 2000
        });
      });
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }]);
})(angular);
