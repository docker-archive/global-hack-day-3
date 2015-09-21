"use strict";

var fs = require('fs');
var commandName = process.argv[2] || "help";
var args = process.argv.slice(3);
var conf = require('./config.json');
var git = require('./git.js');

var scope = {
    commandName: commandName,
    args: args,
    conf: conf,
    appdef: null,
    repo: null,
    enhance: function(cb) {
        git.currentBranch(function(err,branch) {
            if (err) {
                cb(err,branch);
            } else {
                scope.repo = {
                    branch: branch
                };
                git.currentRev(function(err,rev) {
                    if (err) {
                        cb(err,rev);
                    } else {
                        scope.repo.rev = rev;
                        fs.readFile(process.cwd()+'/appdef.json',{encoding: "utf8"},function(err,appdefAsString) {
                            if (err) {
                              cb(Error('There is no appdef file'),appdefAsString);
                            } else {
                                try {
                                    scope.appdef = JSON.parse(appdefAsString);
                                } catch(e) {
                                    err = e;
                                }
                                cb(err,scope);
                            }
                        });                    
                    }
                });
            }
        });
    }
};

module.exports = scope;
