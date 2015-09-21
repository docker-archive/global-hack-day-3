"use strict";

/**
 * execute docker-machine status default and return that.
 * Maybe in the future it will do other stuff
 */

 var machine = require('../../docker-toolbox.js').machine;

 var run = function(good,bad) {
    machine.getStatus(function(err,data) {
        if (err) {
            bad(err);
        } else {
            good(data);
        }
    });
 };

 module.exports = function(Command,scope) {
    return new Command(scope,run);
 };