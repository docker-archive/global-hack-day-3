(function (angular) {
  angular.module('DMM')
    .controller('SettingsCtrl', ['$scope', 'AppConfig', '$ionicHistory', function ($scope, AppConfig, $ionicHistory) {
      $scope.AppConfig = AppConfig;
      console.log(AppConfig);
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }]);
})(angular);
