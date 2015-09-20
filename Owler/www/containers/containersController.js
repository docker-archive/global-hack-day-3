(function (angular) {
  angular.module('Owler')
    .controller('ContainersCtrl', ['$scope', 'Containers', 'AppConfig', '$ionicLoading', function ($scope, Containers, AppConfig, $ionicLoading) {
      $scope.refresh = function () {
        Containers.query({
          all: AppConfig.showAll + 0,
          url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT
        }, function (data) {
          $scope.containers = data;
          $scope.$broadcast('scroll.refreshComplete');
        }, function () {
          $ionicLoading.show({
            template: 'Connection failed ! Please verify your connection settings !',
            noBackdrop: true,
            duration: 2000
          });
        });
      };

      $scope.isUp = function (container) {
        return container.Status.indexOf('Up') > -1;
      };

      $scope.stopContainer = function (container) {
        Containers.stop({
          url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT
        }, {
          id: container.Id
        }, function () {
          $scope.refresh();
        }, function () {
          $ionicLoading.show({
            template: 'Connection failed ! Please verify your connection settings !',
            noBackdrop: true,
            duration: 2000
          });
        });
      };

      $scope.startContainer = function (container) {
        Containers.start({
          url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT
        }, {
          id: container.Id
        }, function () {
          $scope.refresh();
        }, function () {
          $ionicLoading.show({
            template: 'Connection failed ! Please verify your connection settings !',
            noBackdrop: true,
            duration: 2000
          });
        });
      };
      $scope.refresh();
    }]);
})(angular);
