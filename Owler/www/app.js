angular.module('Owler', ['ionic', 'ngResource', 'chart.js', 'angularCancelOnNavigateModule'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
    });
  })
  .value('AppConfig', {
    BASE_URL: 'http://localhost:4243',
    DOCKER_HOST: 'localhost',
    DOCKER_PORT: 4243,
    showAll: 0
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'tabs/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashCtrl'
          }
        },
        cache: false
      })

      .state('tab.containers', {
        url: '/containers',
        views: {
          'tab-containers': {
            templateUrl: 'containers/containers.html',
            controller: 'ContainersCtrl'
          }
        },
        cache: false
      })
      .state('tab.container', {
        url: '/containers/:containerId',
        views: {
          'tab-containers': {
            templateUrl: 'container/container.html',
            controller: 'ContainerDetailCtrl'
          }
        },
        cache: false
      })
      .state('tab.monitoring', {
        url: '/monitoring/:containerId',
        views: {
          'tab-containers': {
            templateUrl: 'monitoring/monitoring.html',
            controller: 'MonitoringCtrl'
          }
        },
        cache: false
      })
      .state('tab.logs', {
        url: '/logs/:containerId',
        views: {
          'tab-containers': {
            templateUrl: 'logs/logs.html',
            controller: 'LogsCtrl'
          }
        },
        cache: false
      })

      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'settings/settings.html',
            controller: 'SettingsCtrl'
          }
        },
        cache: false
      })

      .state('tab.connection', {
        url: '/connection',
        views: {
          'tab-settings': {
            templateUrl: 'settings/connectionSettings.html',
            controller: 'ConnectionSettingsCtrl'
          }
        },
        cache: false
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

  });
