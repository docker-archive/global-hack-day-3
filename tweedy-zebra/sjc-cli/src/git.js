"use strict";

var git = {};
var proc = require('child_process');

git.currentBranch = function(cb){
    proc.exec('git rev-parse --abbrev-ref HEAD | tr -d "\n"',function(error, stdout, stderr) {
        cb(stderr, stdout);
    });
};

git.currentRev = function(cb) {
    proc.exec('git rev-parse HEAD | tr -d "\n"',function(error, stdout, stderr) {
        cb(stderr, stdout);
    });
}

module.exports = git;
