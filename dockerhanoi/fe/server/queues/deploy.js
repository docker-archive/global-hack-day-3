'use strict';
var config = require('config');
var fs = require('fs');
var consumer = {};


consumer.name = 'deploy';

consumer.task = function(job, done){
    var data = job.data;
    var spawn = require('child_process').spawn;
    var exec = require('child_process').exec;
    var path = require('path');

    var dest = path.join(config.get('repositories'), data.App.appName);
    var logStream = fs.createWriteStream(data.logFile, {flags: 'a'});

    // remote repo if exists
    exec('rm -rf ' + dest , function(){
        // clone new source code
        var child = spawn('git', [
          'clone', '--verbose', '--progress', data.gitUrl, dest
        ]);

        child.on('exit', function () {
            // create docker file
            var dockerFile = path.join(dest, 'Dockerfile');
            fs.writeFile(dockerFile, data.dockerFile);

            // create docker compose
            var dockerCompose = path.join(dest, 'docker-compose.yml');
            fs.writeFile(dockerCompose, data.dockerCompose);

            // Run script
            var deployParam = {
                DOCKER_MACHINE_NAME: data.App.appName.replace('/', '-').replace('_', '-'),
                DOCKER_BUILD_TAG: data.App.appName,
                DOCKER_BUILD_PATH: dest,
                AWS_ACCESS_KEY_ID: data.App.awsAccessKeyId,
                AWS_SECRET_ACCESS_KEY: data.App.awsSecretAccessKey,
                AWS_VPC_ID: data.App.awsVpcId,
                AWS_REGION: data.App.awsRegion,
                AWS_SUBNET_ID: data.App.awsSubnetId
            };

            var deployNextStep = {
                logFile: data.logFile,
                params: [config.get('bash.deploy'),
                        deployParam["DOCKER_MACHINE_NAME"],
                        deployParam["DOCKER_BUILD_TAG"],
                        deployParam["DOCKER_BUILD_PATH"],
                        deployParam["AWS_ACCESS_KEY_ID"],
                        deployParam["AWS_SECRET_ACCESS_KEY"],
                        deployParam["AWS_VPC_ID"],
                        deployParam["AWS_REGION"],
                        deployParam["AWS_SUBNET_ID"]
                        ],
                cmd: 'bash',
                id: data.id
            };
            var q = require('../queues');
            q.create('deployNextStep', deployNextStep).priority('high').save();


        });
        // save log to file
        child.stdout.pipe(logStream);
        child.stderr.pipe(logStream);

    });

    done();
};

module.exports = consumer;
