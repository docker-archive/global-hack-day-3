'use strict';
/**
 * @ngdoc function
 * @name DockerizeApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the DockerizeApp
 */
angular.module('DockerizeApp')
.controller('ListUserCtrl', function($scope, $stateParams, Users, APP_CONFIG) {
    var page = $stateParams.page ? parseInt($stateParams.page) : 1,
        limit = $stateParams.limit ? parseInt($stateParams.limit) : APP_CONFIG.pagination.limit;

    $scope.limit = limit;
    Users.list(page, limit).then(function(data){
        $scope.users = data.rows;
        $scope.count = data.count;
    });

    $scope.pageChanged = function() {
        Users.list($scope.current_page, limit).then(function(response){
            $scope.users = response.rows;
        });
    };
    $scope.forUnitTest = true;
})
.controller('ViewUserCtrl', function($scope, $stateParams, Users) {
    Users.get($stateParams.id).then(function(data){
        $scope.user = data;
    });

    $scope.updateUser = function(){
        var userData = {
            id: $scope.user.id,
            firstname: $scope.user.firstname,
            lastname: $scope.user.lastname
        };
        Users.update(userData).then(function(){
            $scope.update_message = 'Updated successfully!';
        });
    };
    $scope.forUnitTest = true;
});
