'use strict';
angular.module('DockerizeApp').factory('Github', function($http, httpi, $q, APP_CONFIG) {
    return {
        getAccessToken: function(code){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.github;
            var request_url = 'https://github.com/login/oauth/access_token';
            var data = {
                code: code,
                request_url: request_url,
                client_id: APP_CONFIG.github.client_id,
                redirect_url: APP_CONFIG.github.redirect_uri
            };
            $http({
                method: 'POST',
                url: url,
                data: data,
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj){
                        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                    }
                    return str.join('&');
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        },
        getRepos: function(access_token){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.github;
            url = 'https://api.github.com/user/repos?access_token=' + access_token;
            $http.get(url).success(function(data){
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        }
    };
});
