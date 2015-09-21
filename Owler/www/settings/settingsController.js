(function (angular) {
  angular.module('Owler')
    .controller('SettingsCtrl', ['$scope', 'AppConfig', '$ionicHistory', function ($scope, AppConfig, $ionicHistory) {
      $scope.AppConfig = AppConfig;
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }]);
})(angular);
