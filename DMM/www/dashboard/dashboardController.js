(function (angular) {
  angular.module('DMM')
    .controller('DashCtrl', ['$scope', 'Docker', function ($scope, Docker) {
      Docker.version({}, function (data) {
        $scope.version = data;
      }, function () {

      });
      Docker.info({}, function (data) {
        $scope.info = data;
      }, function () {

      });
    }]);
})(angular);
