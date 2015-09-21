'use strict';
angular.module('DockerizeApp').factory('Deploys', function($http, httpi, $q, APP_CONFIG) {
    return {
        list: function(AppId, page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.deploys.list;
            var data = {
                AppId: AppId,
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
        get: function(id){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.deploys.get;
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
            var url = APP_CONFIG.services.deploys.create;
//            console.log(data);
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
            var url = APP_CONFIG.services.deploys.update;
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
        }
    };
});
