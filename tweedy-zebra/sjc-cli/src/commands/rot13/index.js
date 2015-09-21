"use strict";

/**
 * An example of a pipe-able command. It takes lines of input as unix pipes, and returns those same lines rot13 encoded
 * @param {String} - a line of text, piped as a unix pipe
 * @return {String} - that same line, rot13 encoded
 * @example cat /etc/passwd | sjc rot13
 */

var rot = require('rot');

var run = function(good,bad) {
    if (this.args.length) {
        good( rot( this.args.join(' ') ) );
    } else {
        bad(Error('You didnt send enough arguments'));
    }
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
