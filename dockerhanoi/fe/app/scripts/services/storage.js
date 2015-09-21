'use strict';
angular.module('DockerizeApp').factory('Storage', function($cookies) {
    return {
        clear: function(){
            $cookies.remove('user_info');
            $cookies.remove('github_access_token');
            $cookies.remove('app_data');
        }
    };
});
