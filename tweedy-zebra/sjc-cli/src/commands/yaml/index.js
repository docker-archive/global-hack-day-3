"use strict";

/**
 * Reads a yml file and returns it as a javascript object. Currently not supported, as we are just going with JSON
 * @todo  This should be incorporated into 1 command, so that there is one way to get an appdef, and the user should not care whether it's yml or json
 */

var readYaml = require('read-yaml'),
    Command = require('../../Command.js');

var run = function(good,bad) {
    readYaml( process.cwd() + '/sjc.yml' , function(err, data) {
        if (err) {
            bad(err);
        } else {
            good(data);
        }
    });
};

module.exports = function(scope){
    return new Command(scope,run);
};