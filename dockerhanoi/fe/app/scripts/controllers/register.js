'use strict';
/**
 * @ngdoc function
 * @name DockerizeApp.controller:RegisterCtrl
 * @description
 * # UserCtrl
 * Controller of the DockerizeApp
 */
angular.module('DockerizeApp')
    .controller('RegisterCtrl', function($scope, Users, $cookies, $location, $rootScope) {
        var vs = this;
        vs.register = function login(){
            var userData = {
                username: vs.username,
                password: vs.password,
                firstname: vs.firstname,
                lastname: vs.lastname
            };
            Users.register(userData).then(function(data){
                $rootScope.user_info = data;
                $cookies.put('user_info', JSON.stringify(data));
                vs.error = null;
                $location.path('/dockerize/start');
            }).catch(function(){
                vs.error = 'Register Denied!';
            });
        };
    });
