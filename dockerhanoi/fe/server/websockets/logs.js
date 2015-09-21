'use strict';
var Tail = require('tail').Tail;
var config = require('config');
var path = require('path');
var db = require('../models');
module.exports = function(ws) {
    ws.on('message', function(msg) {
        db.Deploy.findOne({
            where: {
                id: msg
            }
        }).then(function(deploy){
            try{
                var logFile = path.join(config.get('logs'), deploy.AppId.toString(), deploy.id.toString() + '.log');
                var tail = new Tail(logFile);
                var fs = require('fs');

                // read file
                fs.readFile(logFile, 'utf8', function (err,data) {
                    if (err) {
                        ws.send(err + '\n');
                    }
                    ws.send(data + '\n');
                });

                // tail file
                tail.on('line', function(data) {
                    try {
                        ws.send(data + '\n');
                    } catch(e){}
                });

            } catch(e){
                console.log(e);
            }
        });
    });
};
