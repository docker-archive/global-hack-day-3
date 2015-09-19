(function (angular) {
  angular.module('DMM')
    .controller('ContainerDetailCtrl', ['$scope','$stateParams','Containers', function ($scope,$stateParams, Containers) {
    Containers.get({id : $stateParams.containerId}, function (data) {
            $scope.container = data;
          }, function () {

          });

    $stateParams.containerId;
    }]);
})(angular);
