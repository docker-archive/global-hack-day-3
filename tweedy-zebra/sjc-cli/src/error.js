"use strict";

var playsound = require('./playsound.js'),
    scope = require('./scope'),
    fancy = require('./fancy.js');

function CLIError(err) {
    this.name = 'sjc cli Error';
    var message = err.message || this.name;
    this.message = fancy(message,'error');
    playsound('bad');
    console.error(this.message);
}
CLIError.prototype = Object.create(Error.prototype);
CLIError.prototype.constructor = CLIError;

module.exports = CLIError;