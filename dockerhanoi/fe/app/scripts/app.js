'use strict';
/**
 * @ngdoc overview
 * @name DockerizeApp
 * @description
 * # DockerizeApp
 *
 * Main module of the application.
 */
angular
.module('DockerizeApp')
.filter('nl2br', function($sce){
    return function(msg,is_xhtml) { 
        is_xhtml = is_xhtml || true;
        var breakTag = (is_xhtml) ? '<br />' : '<br>';
        msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
        return $sce.trustAsHtml(msg);
    };
})
.config(function ($translateProvider) {
    $translateProvider.useMissingTranslationHandlerLog();
})
.config(function ($compileProvider, APP_CONFIG) {
    if (!APP_CONFIG.debug_mode) {
        $compileProvider.debugInfoEnabled(false);// disables AngularJS debug info
    }
})
.config(function ($translateProvider, APP_CONFIG) {
    if (APP_CONFIG.debug_mode) {
        $translateProvider.useMissingTranslationHandlerLog();// warns about missing translates
    }

    $translateProvider.useStaticFilesLoader({
        prefix: 'resources/locale-',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage(APP_CONFIG.locales.preferredLocale);
    $translateProvider.useLocalStorage();
})
.config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
})
.config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider', '$httpProvider',
        function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider, $httpProvider) {

    $ocLazyLoadProvider.config({
        debug:false,
        events:true,
    });

    $urlRouterProvider.otherwise('/dockerize/start');

    $stateProvider
    .state('login',{
        templateUrl:'views/pages/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm',
        url:'/login',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'DockerizeApp',
                        files:[
                            'scripts/controllers/login.js',
                            'scripts/services/users.js',
                            'scripts/services/httpi.js',
                            'scripts/services/locale.js',
                            'scripts/services/storage.js',
                            'scripts/directives/locale/locale.js'
                        ]
                    });
            }
        }
    })
    .state('register',{
        templateUrl:'views/pages/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'vs',
        url:'/register',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'DockerizeApp',
                        files:[
                            'scripts/controllers/register.js',
                            'scripts/services/users.js',
                            'scripts/services/httpi.js',
                            'scripts/services/locale.js',
                            'scripts/directives/locale/locale.js'
                        ]
                    });
            }
        }
    })
    .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'DockerizeApp',
                        files:[
                            'scripts/directives/header/header.js',
                            'scripts/directives/header/header-notification/header-notification.js',
                            'scripts/directives/sidebar/sidebar.js',
                            'scripts/directives/sidebar/sidebar-search/sidebar-search.js',
                            'scripts/services/httpi.js',
                            'scripts/services/locale.js',
                            'scripts/services/apps.js',
                            'scripts/directives/locale/locale.js'
                        ]
                    });
            }
        }
    })
    .state('dockerize', {
        url:'/dockerize',
        controller:'DockerizeCtrl',
        controllerAs: 'dk',
        templateUrl: 'views/dockerize/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'DockerizeApp',
                        files:[
                            'scripts/controllers/dockerize.js',
                            'scripts/directives/header/header.js',
                            'scripts/directives/header/header-notification/header-notification.js',
                            'scripts/directives/sidebar/sidebar.js',
                            'scripts/directives/sidebar/sidebar-search/sidebar-search.js',
                            'scripts/services/httpi.js',
                            'scripts/services/locale.js',
                            'scripts/directives/locale/locale.js',
                            'scripts/services/github.js',
                            'scripts/services/apps.js',
                            'scripts/services/deploys.js'
                        ]
                    });
            }
        }
    })
    .state('dockerize.start', {
        url:'/start',
        templateUrl: 'views/dockerize/start.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'DockerizeApp',
                    });
            }
        }
    })
    .state('dockerize.github', {
        url:'/github',
        controller:'GithubCtrl',
        templateUrl: 'views/dockerize/github.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'DockerizeApp',
                    });
            }
        }
    })
    .state('dockerize.create', {
        url:'/create',
        templateUrl: 'views/dockerize/create.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'DockerizeApp',
                    });
            }
        }
    })
    .state('dockerize.confirm', {
        url:'/confirm',
        templateUrl: 'views/dockerize/confirm.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'DockerizeApp',
                    });
            }
        }
    })
    .state('dockerize.deploy', {
        url:'/deploy',
        templateUrl: 'views/dockerize/deploy.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'DockerizeApp',
                    });
            }
        }
    })
    .state('dockerize.finish', {
        url:'/finish',
        templateUrl: 'views/dockerize/finish.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'DockerizeApp',
                    });
            }
        }
    })
    .state('dashboard.app_view',{
        templateUrl:'views/apps/view.html',
        controller:'ViewAppCtrl',
        url:'/app/view/:id',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'DockerizeApp',
                    files:[
                        'scripts/controllers/apps.js',
                        'scripts/services/deploys.js',
                        'scripts/services/apps.js'
                    ]
                });
            }
        }
    })
    .state('dashboard.app_deploys',{
        templateUrl:'views/apps/deploys.html',
        controller:'DeploysAppCtrl',
        url:'/app/deploys/:id',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'DockerizeApp',
                    files:[
                        'scripts/controllers/apps.js',
                        'scripts/services/deploys.js',
                    ]
                });
            }
        }
    })
    .state('dashboard.app_monitor',{
        templateUrl:'views/apps/monitor.html',
        controller:'MonitorAppCtrl',
        url:'/app/monitor/:id',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'DockerizeApp',
                });
            }
        }
    })
    .state('dashboard.app_logs',{
        templateUrl:'views/apps/logs.html',
        controller:'LogsAppCtrl',
        url:'/app/logs/:id',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'DockerizeApp',
                });
            }
        }
    })
    .state('dashboard.app_deploy',{
        templateUrl:'views/apps/deploy.html',
        controller:'DeployAppCtrl',
        url:'/app/deploy/:id',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'DockerizeApp',
                    files:[
                        'scripts/controllers/apps.js',
                        'scripts/services/apps.js',
                        'scripts/services/websocket.js'
                    ]
                });
            }
        }
    })
    .state('dashboard.home',{
        url:'/home',
        templateUrl:'views/dashboard/home.html',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'DockerizeApp',
                    files:[
                        'scripts/directives/timeline/timeline.js',
                        'scripts/directives/notifications/notifications.js',
                        'scripts/directives/chat/chat.js',
                        'scripts/directives/dashboard/stats/stats.js'
                    ]
                });
            }
        }
    })
    .state('dashboard.user_setting',{
        templateUrl:'views/users/setting.html',
        url:'/users/setting',
    })
    .state('dashboard.user_view',{
        templateUrl:'views/users/view.html',
        controller:'ViewUserCtrl',
        url:'/users/view/:id',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'DockerizeApp',
                    files:[
                        'scripts/controllers/users.js',
                        'scripts/services/users.js',
                    ]
                });
            }
        }
    })
    .state('dashboard.users',{
        templateUrl:'views/users/list.html',
        controller:'ListUserCtrl',
        url:'/users/:page/:limit',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'DockerizeApp',
                    files:[
                        'scripts/controllers/users.js',
                        'scripts/services/users.js',
                    ]
                });
            }
        }
    });
    $httpProvider.interceptors.push('httpRequestInterceptor');
}])
.run(['$location', '$cookies', '$rootScope', function($location, $cookies, $rootScope){
    // keep user logged in after page refresh
    var user_info = $cookies.get('user_info') || '{}';
    $rootScope.user_info = JSON.parse(user_info);
    $rootScope.$on('$locationChangeStart', function () {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = ($location.path() !== '/login') && ($location.path() !== '/register');
        var loggedIn = ($rootScope.user_info)? $rootScope.user_info.token: false;
        if (restrictedPage && !loggedIn){
            $location.path('/login');
        }
    });
    $rootScope.$on('unauthorized', function() {
        $location.path('/login');
    });
}])
.factory('httpRequestInterceptor', function ($rootScope, $cookies, $location) {
    var ret = {
        request: function (config) {
            var user_info = $cookies.get('user_info') || '{}';
            $rootScope.user_info = JSON.parse(user_info);
            config.headers.Authorization = $rootScope.user_info.token;
            return config;
        }
    };
    if ($location.path() !== '' && $location.path() !== '/login') {
        ret.responseError = function(response){
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return response;
        };
    }
    return ret;
});
