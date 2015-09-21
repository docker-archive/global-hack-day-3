'use strict';
var fs = require('fs');
var db = require('../models');
var consumer = {};

consumer.name = 'deployFinish';

consumer.task = function(job, done){
    var data = job.data;

    db.Deploy.find({
        where: {
            id: data.id
        }
    }).then(function(deploy) {
        if (deploy) {
            deploy.updateAttributes({
                deployStatus: 'FINISH'
            }).then(function(){
                var logS = fs.createWriteStream(data.logFile, {flags: 'a'});
                logS.write('FINISH!!!\n');
                logS.end();
            });
        }
    });
    done();
};

module.exports = consumer;
