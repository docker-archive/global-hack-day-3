'use strict';
angular.module('DockerizeApp').factory('Apps', function($http, httpi, $q, APP_CONFIG) {
    return {
        list: function(UserId, page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.apps.list;
            var data = {
                UserId: UserId,
                page: page,
                limit: limit
            };
            httpi({
                method: 'GET',
                url: url,
                data: data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        },
        deploy: function(id){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.apps.deploy;
            httpi({
                method: 'GET',
                url: url,
                data: {
                    id: id
                }
            }).success(function(data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        },
        get: function(id){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.apps.get;
            httpi({
                method: 'GET',
                url: url,
                data: {
                    id: id
                }
            }).success(function(data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        },
        create: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.apps.create;
            httpi({
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
        update: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.apps.update;
            httpi({
                method: 'PUT',
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
        getByAppName: function(name){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.apps.getByAppName;
            httpi({
                method: 'GET',
                url: url,
                data: {appName : name}
            }).success(function(data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        }
    };
});
