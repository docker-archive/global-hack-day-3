(function (angular) {
  angular.module('DMM')
    .controller('ContainersCtrl', ['$scope', 'Containers', function ($scope, Containers) {
      Containers.query({}, function (data) {
        $scope.containers = data;
      }, function () {

      })
    }]);
})(angular);
