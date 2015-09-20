(function (angular) {
  angular.module('Owler')
    .controller('LogsCtrl', ['$scope', '$stateParams', 'Containers', 'AppConfig', function ($scope, $stateParams, Containers, AppConfig) {
      var nbStandard = 10;
      var nbErrors = 10;
      var nbMoreStandard = 1;
      var nbMoreErrors = 1;

      $scope.getLog = function(isStandard, isMore) {
        if (isMore) {
          var nb = isStandard ? nbMoreStandard++ : nbMoreErrors++;
          var nbMore = Math.floor(Math.sqrt(nb) * 10);
          if (isStandard) {
            nbStandard += nbMore;
          } else {
            nbErrors += nbMore;
          }
        }
        Containers.logs(
          {
            id: $stateParams.containerId,
            url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT,
            stdout:isStandard,
            stderr:!isStandard,
            tail : isStandard ? nbStandard : nbErrors
          },
          function (data) {
            if(isStandard)  {
            $scope.standard = data.content;
            } else {
            $scope.errors= data.content;
            }
          },
          angular.noop
        );
      };

      $scope.refresh = function() {
        $scope.getLog(true, false);
        $scope.getLog(false, false);
      }

      $scope.refresh();
    }]);
})(angular);
