(function (angular) {
  angular.module('DMM')
    .controller('DashCtrl', ['$scope', 'Docker', '$ionicHistory', function ($scope, Docker, $ionicHistory) {
      Docker.version({}, function (data) {
        $scope.version = data;
      }, function () {

      });
      Docker.info({}, function (data) {
        $scope.info = data;
      }, function () {

      });
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }]);
})(angular);
