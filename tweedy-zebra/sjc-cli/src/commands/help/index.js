"use strict";

/** User Documentation
 * Outputs help documentation by parsing docblock comments in each of the commands subfolders.
 * @arg {String} commmandName - The command you want help on.
 * @returns {String} - Help information on the specified command, or general help
 * @example sjc help
 * @example sjc help deploy
 */

var fancy = require('../../fancy.js'),
    fs = require('fs'),
    colour = require('bash-color');

var run = function(resolve,reject) {
    // the default invocation is "sjc help help", which produces general help
    var helpwhat = this.args[0] || 'help';
    //  convert markdown to coloured bash output
    var markdownToTTY = function(mdline) {
        var r = mdline;
        var isHeading = /^#\s+/;
        if (isHeading.test(mdline)) {
            r = colour.cyan( r.replace(isHeading,'') );
        }
        return r;
    };
    var parseDocBlock = function(txt) {
        var docblockBegin = -1, docblockEnd = false;
        var docblock = txt.split("\n").filter(function(line,lineNumber) {
            if (/^\/\*\*\s*$/.test(line)) {
                docblockBegin = lineNumber;
            } else if (docblockBegin && /^\s*\*\/\s*$/.test(line)) {
                docblockEnd = true;
            }
            return ( (docblockBegin > -1 && lineNumber > docblockBegin) && (!docblockEnd) );
        }).map(function(line) {
            var niceLine = line;
            niceLine = niceLine.replace(/^[\s\*]+/,'');
            niceLine = niceLine.replace(/@\w+/, colour.purple('$&') );
            return niceLine;
        }).filter(function(line) { return /\w/.test(line); }).join("\n");
        return docblock;
    };
    switch (helpwhat) {
        case 'help':
        case undefined:
        case null:
        case 'everything':
            fs.readFile(__dirname + '/help.md',{"encoding": "utf-8"},function(err,txt) {
                if (err) reject(err);
                var r = txt.split("\n").map(markdownToTTY).join("\n");
                fs.readdir(__dirname + '/../../commands/',function(err,files) {
                    if (err) {
                        reject(err);
                    } else {
                        files.forEach(function(folderName) {
                            r += colour.blue(folderName,true) + "\n" + parseDocBlock(fs.readFileSync(__dirname + '/../../commands/' + folderName + '/index.js',{"encoding": "utf-8"})) + "\n\n";
                        });
                        resolve(r);
                    }
                });
            });
        break;
        default:
            fs.readFile(__dirname + '/../../commands/' + helpwhat + '/index.js',{"encoding": "utf-8"},function(err,txt) {
                if (err) {
                    reject(err);
                } else {
                    var heading = colour.blue(helpwhat,true);
                    resolve( heading + "\n\n" + parseDocBlock(txt) );
                }
            });
        break;
    }
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
