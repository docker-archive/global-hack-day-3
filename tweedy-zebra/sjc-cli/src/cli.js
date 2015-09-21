"use strict";

var fs = require('fs'),
    CLIError = require('./error.js'),
    scope = require('./scope.js'),
    Command = require('./Command.js'),
    commandName = process.argv[2] || "help",
    command  = function() {},   // jscs:disable requireSpacesInFunction, requireSpaceBeforeBlockStatements
    args = process.argv.slice(3),
    legalCommandNames = [];

function good(stuff) {
    //  handle good return data
    switch (typeof stuff) {
        case 'function':
            stuff();
        break;
        case 'number':
        case 'string':
        case 'object':
            console.log(stuff);
        break;
    }
}

function bad(errorOrString) {
    //  handle error data from commands
    var error;
    if (typeof errorOrString === 'string') {
        error = new Error(errorOrString);
    } else if ( errorOrString instanceof Error ) {
        error = errorOrString;
    } else {
        error = Error('Badly Invoked Error with type: ' + typeof errorOrString);
        console.error(errorOrString);
    }
    throw new CLIError(error);
}

function main() {
    command(Command,scope).then(good).catch(bad);
}

fs.readdir( __dirname + '/commands',function(err,files){
    if (err) {
        throw new CLIError(err);
    }
    legalCommandNames = files.map(function(fylename){
        return fylename.replace(/\.js$/,'');
    });
    if (legalCommandNames.indexOf(commandName) > -1) {
        command = require('./commands/' + commandName);
    } else {
        command = function(Command,scope) {
            return new Promise(function(resolve,reject){
                reject('command  ' + commandName + ' does not exist');
            });
        };
    }
    main();
});