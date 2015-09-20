(function (angular) {
  angular.module('Owler')
    .controller('MonitoringCtrl', ['$scope', '$stateParams', '$timeout', 'Containers', 'AppConfig', function ($scope, $stateParams, $timeout, Containers, AppConfig) {
      var intervalLoad = 1000;
      var maxInformation = 10;

      Chart.defaults.global.animation = false;

      var pushData = function (tab, data) {
        tab.shift();
        tab.push(data);
      };

      var lastData = null;
      $scope.loadData = function () {
        Containers.stats(
          {
            id: $stateParams.containerId,
            url: AppConfig.DOCKER_HOST + ':' + AppConfig.DOCKER_PORT
          },
          function (data) {
            var nbCpu = data.cpu_stats.cpu_usage.percpu_usage.length;
            if (!lastData) {
              // Init CPU chart
              for (var cpu = 0; cpu <= nbCpu; cpu++) {
                $scope.cpu.push([]);
                $scope.cpuSeries.push('CPU ' + (cpu+1));
                for (var i = 0; i < maxInformation; i++) {
                  $scope.cpu[cpu].push(0);
                }
              }
            } else {
              var cpuDeltas = [];
              var sysDelta = data.cpu_stats.system_cpu_usage - lastData.cpu_stats.system_cpu_usage;
              sysDelta ? 0 : sysDelta = 1;

              for (var cpu = 0; cpu < nbCpu; cpu++) {
                var cpuDeltas = data.cpu_stats.cpu_usage.percpu_usage[cpu] - lastData.cpu_stats.cpu_usage.percpu_usage[cpu];
                pushData($scope.cpu[cpu + 1], cpuDeltas / sysDelta * 100);
              }

              pushData($scope.memory[0], data.memory_stats.usage / data.memory_stats.limit * 100);

              var lanDelta = data.network.rx_bytes - lastData.network.rx_bytes;
              pushData($scope.lan[0], lanDelta / 1024);
            }
            lastData = data;
            $scope.timeout = $timeout($scope.loadData, intervalLoad);
          },
          angular.noop
        );
      };

      var init = function () {
        $scope.cpu = [];
        $scope.memory = [[]];
        $scope.lan = [[]];
        $scope.blank_label = [];
        for (var i = 0; i < maxInformation; i++) {
          $scope.memory[0].push(0);
          $scope.lan[0].push(0);
          $scope.blank_label.push('');
        }
        $scope.cpuSeries = [];
        $scope.memorySeries = [''];
        $scope.lanSeries = [''];

        $scope.loadData();
      };


      init();


    }]);
})(angular);
