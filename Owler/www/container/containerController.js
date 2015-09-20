(function (angular) {
  angular.module('Owler')
    .controller('ContainerDetailCtrl', ['$scope', '$stateParams', 'Containers', 'AppConfig', '$ionicLoading', function ($scope, $stateParams, Containers, AppConfig, $ionicLoading) {
      Containers.get({
        id: $stateParams.containerId,
        url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT
      }, function (data) {
        $scope.container = data;
      }, function () {
        $ionicLoading.show({
          template: 'Connection failed ! Please verify your connection settings !',
          noBackdrop: true,
          duration: 2000
        });
      });

      // #FIX ME
      $scope.getStatus = function () {
        return $scope.container ? $scope.container.State.Running ? 'Running ' : 'Stopped' : '';
      };
    }]);
})(angular);
