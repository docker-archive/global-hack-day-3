(function (angular) {
  angular.module('DMM')
    .controller('ContainerDetailCtrl', ['$scope', '$stateParams', 'Containers', 'AppConfig', function ($scope, $stateParams, Containers, AppConfig) {
      Containers.get({
        id: $stateParams.containerId,
        url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT
      }, function (data) {
        $scope.container = data;
      }, angular.noop);

      $scope.getStatus = function () {
        return $scope.container ? $scope.container.State.Running : '';
      };
    }]);
})(angular);
