"use strict";

/**
 * used as a constructor to instiate commands. see the commands/ folder
 * @arg {String} commandName - The name of the command. Convenient but not crucial. Helps with debugging
 * @arg {Array} args - The arguments passed into the command
 * @arg {Object} scope - A collection of "global-type" variables that should be available to any command that wants it
 * @arg {Function} run - The logic of the command lives here.
 */

var good = console.log;
var bad = console.error;

//  quick and dirty polyfill
if (!Object.assign) {
    Object.assign = function(a,b) {
        var c = JSON.parse(JSON.stringify(b));
        return c;
    };
}

module.exports = function(scope,run) {
    if (process.stdin.isTTY) {
        return new Promise(run.bind(scope));
    } else {
        return new Promise(function(resolve,reject) {
            var exitcode = 0;
            process.stdin.resume();
            process.stdin.setEncoding('utf8');
            process.stderr.on('data', function(err) {
                exitcode = 1;
                bad(err);
            });
            process.stdin.on('data', function(lines) {
                lines.split("\n").forEach(function(line) {
                    var newScope = Object.assign({}, scope);
                    newScope.args = [line].concat(scope.args);
                    run.call(newScope,good,bad);
                });
            });
            process.stdin.on('end', function(data) {
                resolve( process.exit.bind(process,exitcode) );
            });
        });
    }
};
