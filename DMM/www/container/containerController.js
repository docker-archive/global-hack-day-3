(function (angular) {
  angular.module('DMM')
    .controller('ContainerDetailCtrl', ['$scope', '$stateParams', 'Containers', function ($scope, $stateParams, Containers) {
      Containers.get({
        id: $stateParams.containerId
      }, function (data) {
        $scope.container = data;
      }, angular.noop);

      $scope.getStatus = function () {
        return $scope.container ? $scope.container.State.Running : '';
      };
    }]);
})(angular);
