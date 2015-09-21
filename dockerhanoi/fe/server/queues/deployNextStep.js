'use strict';
var fs = require('fs');
var consumer = {};

consumer.name = 'deployNextStep';

consumer.task = function(job, done){
    var data = job.data;
    var spawn = require('child_process').spawn;

    // clone new source code
    var child = spawn(data.cmd, data.params, data.env);

    child.on('exit', function(){
        // trigger finish deploy
        var deployFinish = {
            logFile: data.logFile,
            id: data.id
        };
        var q = require('../queues');
        q.create('deployFinish', deployFinish).priority('high').save();
    });

    // save log to file
    var logStream = fs.createWriteStream(data.logFile, {flags: 'a'});
    child.stdout.pipe(logStream);
    child.stderr.pipe(logStream);

    done();
};

module.exports = consumer;
