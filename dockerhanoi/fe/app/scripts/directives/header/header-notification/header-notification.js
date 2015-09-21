'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('DockerizeApp')
.directive('headerNotification',function(){
    return {
        templateUrl:'scripts/directives/header/header-notification/header-notification.html',
        restrict: 'E',
        replace: true,
        scope: {
        },
        controller: function($scope, Apps, $location, $cookies) {
            try{
                var userInfo = JSON.parse($cookies.get('user_info'));
            } catch(e) {
                $location.path('/login');
            }

            Apps.list(userInfo.id, 1,10).then(function(data){
                $scope.apps = data.rows;
            });
        }
    }
});


