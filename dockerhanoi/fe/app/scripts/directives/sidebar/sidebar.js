'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('DockerizeApp')
.directive('sidebar',['$location',function() {
    return {
        templateUrl:'scripts/directives/sidebar/sidebar.html',
        restrict: 'E',
        replace: true,
        scope: {
        },
        controller:function($scope, $stateParams){
            $scope.selectedMenu = 'dashboard';
            $scope.collapseVar = 0;
            $scope.multiCollapseVar = 0;

            $scope.appId = $stateParams.id;
            $scope.$on('$locationChangeSuccess', function() { 
                $scope.appId = $stateParams.id;
            });

            $scope.check = function(x){

                if(x==$scope.collapseVar)
                    $scope.collapseVar = 0;
                else
                    $scope.collapseVar = x;
            };

            $scope.multiCheck = function(y){

                if(y==$scope.multiCollapseVar)
                    $scope.multiCollapseVar = 0;
                else
                    $scope.multiCollapseVar = y;
            };
        }
    }
}]);
