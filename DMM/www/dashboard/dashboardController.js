(function (angular) {
  angular.module('DMM')
    .controller('DashCtrl', ['$scope', 'Docker', '$ionicHistory', 'AppConfig', function ($scope, Docker, $ionicHistory, AppConfig) {
      Docker.version({
        url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT
      }, function (data) {
        $scope.version = data;
      }, function () {

      });
      Docker.info({
        url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT
      }, function (data) {
        $scope.info = data;
      }, function () {

      });
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }]);
})(angular);
