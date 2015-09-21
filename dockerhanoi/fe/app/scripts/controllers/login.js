'use strict';
/**
 * @ngdoc function
 * @name DockerizeApp.controller:LoginCtrl
 * @description
 * # UserCtrl
 * Controller of the DockerizeApp
 */
angular.module('DockerizeApp')
    .controller('LoginCtrl', function($scope, Users, $cookies, $location, $rootScope, Storage) {
        var vm = this;
        // logout before login
        $rootScope.user_info = {};
        Storage.clear();
        vm.login = function login(){
            Users.login(vm.username, vm.password).then(function(data){
                $rootScope.user_info = data;
                $cookies.put('user_info', JSON.stringify(data));
                vm.error = null;
                $location.path('/dashboard/home');
            }).catch(function(){
                vm.error = 'Access Denied!';
            });
        };
    });
