'use strict';
/**
 * @ngdoc function
 * @name DockerizeApp.controller:DockerizeCtrl
 * @description
 * # UserCtrl
 * Controller of the DockerizeApp
 */
angular.module('DockerizeApp')
    .controller('GithubCtrl', function($scope, APP_CONFIG, $location, Github, $cookies, Apps) {
        //get query param
        var parseLocation = function(location) {
            var pairs = location.substring(1).split('&');
            var obj = {};
            var pair;
            var i;

            for ( i in pairs ) {
                if ( pairs[i] === '' ) {
                    continue;
                }

                pair = pairs[i].split('=');
                obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
            }

            return obj;
        };
        $scope.dockerize = true;
        var githubCode = parseLocation(window.location.search).code;

        var access_token = $cookies.get('github_access_token');

        if (githubCode && !access_token){
            Github.getAccessToken(githubCode).then(function(data){
                var access_token = data.access_token;
                $cookies.put('github_access_token', access_token);
                Github.getRepos(access_token).then(function(data){
                    $scope.repos = data;
                });
            });
        } else {
            Github.getRepos(access_token).then(function(data){
                $scope.repos = data;
            });
        }

        var user = JSON.parse($cookies.get('user_info'));
        $scope.selectRepo = function(repo){
            var app = {
                userId: user.id,
                appName: repo.full_name,
                gitUrl: repo.git_url,
                htmlUrl: repo.html_url,
                dockerFile: '',
                dockerCompose: ''
            };

            Apps.create(app).then(function(data){
                if ('id' in data === false){
                    throw 500;
                }
                app.id = data.id;
                $cookies.put('app_data', JSON.stringify(app));
                $location.path('/dockerize/create');
            }).catch(function(){
                Apps.getByAppName(encodeURI(app.appName)).then(function(data){
                    app.id = data.id;
                    $cookies.put('app_data', JSON.stringify(app));
                    $location.path('dockerize/create');
                });
            });
        
        };
        
    })
    .controller('DockerizeCtrl', function($scope, APP_CONFIG, $cookies, $location, Apps) {
        $scope.dockerize = true;

        var userInfo = $cookies.get('user_info');
        try{
            userInfo = JSON.parse(userInfo);
            if (!('id' in userInfo)){
                throw '';
            }
        } catch (e) {
            $location.path('/login');
        }

        Apps.list(userInfo.id, 1,10).then(function(data){
            $scope.apps = data.rows;
        });

        $scope.connectGithub = function(){
            var url = 'https://github.com/login/oauth/authorize?scope=repo&client_id=' + 
                    APP_CONFIG.github.client_id + '&redirect_url=' + APP_CONFIG.github.redirect_uri;
            window.location.replace(url);
        };

        $scope.workdir = '/build';
        $scope.command = '/bin/bash';

        try{
            $scope.appData = JSON.parse($cookies.get('app_data'));
        } catch(e) {
            $scope.appData = {};
        }

        $scope.createDocker = function(){
            var dockerFile =  'FROM ' + $scope.osSelected + '\n' +
                'MAINTAIN Docker Hanoi \n' +
                'RUN apt-get update && apt-get install -y ' +
                $scope.depSelected.join(' ') + '\n' +
                'WORKDIR ' + $scope.workdir + '\n' +
                'CMD ' + $scope.command;

            var link = '  links:\n';
            for (var l in $scope.linkSelected){
                link += '   - ' + $scope.linkSelected[l] + '\n';
            }
            for (l in $scope.linkSelected){
                link += $scope.linkSelected[l] + ':\n' + 
                    '  image: ' + $scope.linkSelected[l] + ':latest\n';
            }
            var dockerCompose = 'app:\n' + 
                '  build: ./\n' +
                '  ports:\n' +
                '    - ' + $scope.exposeSelected + '\n' + link;

            $scope.appData = JSON.parse($cookies.get('app_data'));

            $scope.appData.dockerFile = dockerFile;
            $scope.appData.dockerCompose = dockerCompose;
            $location.path('/dockerize/confirm');
        };

        // save infor to database
        $scope.finish = function(){
            Apps.update($scope.appData).then(function(data){
                $location.path('/dashboard/app/view/' + data.id);
            });
        };
        // auto complete form
        $scope.listOs = ['Ubuntu:14.04', 'Ubuntu:12.04', 'Centos:6', 'Centos:7'];
        $scope.listDep = ['Apache2', 'Nginx', 'NodeJS 0.10.25', 'NodeJS 0.8'];
        $scope.listLink = ['Mysql', 'Redis', 'PostgreSQL', 'Cassandra', 'MongoDB'];
        $scope.listExpose = ['80:80', '8080:8080', '3000:3000', '9000:9000'];

        $scope.linkSelected = [];
        $scope.depSelected = [];
        $scope.selectOs = function(item){
            try{
                $scope.osSelected = item.toLowerCase();
            } catch(e){}
        };
        $scope.selectExpose = function(item){
            try{
                $scope.exposeSelected = item.toLowerCase();
            } catch(e){}
        };
        $scope.selectDep = function(item){
            try{
                $scope.depSelected.push(item.toLowerCase());
            } catch(e){}
        };
        $scope.removeDep = function(index){
            try{
                $scope.depSelected.splice(index, 1);
            } catch(e){}
        };
        $scope.selectLink = function(item){
            try{
                $scope.linkSelected.push(item.toLowerCase());
            } catch(e){}
        };
        $scope.removeLink = function(index){
            try{
                $scope.linkSelected.splice(index, 1);
            } catch(e){}
        };

    });
