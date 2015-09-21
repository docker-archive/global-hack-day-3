"use strict";

/**
 * open a browser with the desired app
 * @param {Container ID} either a one or two digit number representing the N column, or a longer string representing the ID column
 * @returns {nothing} (Launches the user's default browser with the specified app)
 * @example sjc browse 1
 * @example sjc browse ef4a
 */

var d = require('../../docker-toolbox.js'),
    fancy = require('../../fancy.js'),
    spawn = require('child_process').spawn;

//  platform-specifc config
var ubuntu = {
    command: 'xdg-open',
};
var osx = {
    command: 'open'
};
var options = {
    stdio: ['ignore','ignore','ignore'],
    detached: true
};
var params = {};
ubuntu.options = osx.options = options;
switch (process.platform.toLocaleLowerCase()) {
    case 'darwin':
    params.command = osx.command;
    params.options = osx.options;
    break;
    case 'linux':
    default:
    params.command = ubuntu.command;
    params.options = ubuntu.options;
    break;
}

var run = function(good,bad) {
    var action;
    if (!(this.args.length)) {
        bad('you need to pass container index or partial id');
    } else {
        d.getContainer(this.args[0],function(err,container) {
            if (err) {
                bad(err);
            } else {
                params.args = [container.url];
                action = spawn(params.command,params.args,params.options);
                good( fancy(container.url,'default') );
            }
        });        
    }
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
