"use strict";

/**
 * Start an app. 
 * @param {String} - appname [ --hard: --soft ]
 * @return {String} - the output produced by the docker after is spins up the container
 * @example sjc start .	# starts the app at the current directory with the currently checkout branch
 * @example sjc start cerebrum	# starts the app called cerebrum regardless of current directory, with the currently checkout out branch
 * @example sjc start cerebrum:CE-167	# start the app "cerebrum" as the "CE-167" branch.
 * @example sjc start cerebrum --hard	# starts the app with no mounting of local directories into the host.
 */

var d = require*('../../docker-toolbox.js').docker;
var child_process = require('child_process');
var colour = require('bash-color');
var git = require('../../git');
var fancy = require('../../fancy');

var run = function(good,bad) {
    var scope = this;
    var params = {
        command: process.cwd() + '/run.sh',
        args: this.args,
        options: {}
    };
    scope.enhance(function(err,ok){
        git.currentBranch(function(err,branch){
            if (err) {
                bad(err);
            } else {
                child_process.execFile(params.command,params.args,params.options,function(err,stdout,stderr) {
                    if (err) {
                        bad(err);
                    } else {
                        good(fancy(scope.appdef.project.name + ' / ' + scope.appdef.name + ' : ' +  branch + ' now running' ,'success'));
                    }
                });
            }
        });
    });
};

module.exports = function(Command,scope) { 
    return new Command(scope,run);
};
