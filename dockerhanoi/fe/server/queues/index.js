'use strict';
var kue = require('kue'),
    config = require('config'),
    path = require('path'),
    fs = require('fs');

var q = kue.createQueue({
    prefix: config.get('redis.prefix'),
    redis: {
        port: config.get('redis.port'),
        host: config.get('redis.host'),
        auth: config.get('redis.password')
    }
});

fs.readdirSync(__dirname)
.filter(function(file){
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
})
.forEach(function(file){
    var consumer = require(path.join(__dirname, file));
    q.process(consumer.name, consumer.task);
    
});

module.exports = q;
