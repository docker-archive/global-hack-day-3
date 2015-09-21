"use strict";

/**
 * Lists running apps or containers or maybe other stuff like hosts, tagets, users, etc. The default invocation is to simply list all running containers. This is a good example of how to implement subcommands
 * @todo  add --all flag that *explicitely* lists all of said items
 * @todo  add --apps flag that only lists ambassadors (also --ambassadors should do the same thing)
 * @todo  this should also query the app-regisrty service to get more information. currenty it only talks to the local docker host
 * @todo  add --target flag to filer by target.
 * @example sjc ls (is the same as)
 * @example sjc ls containers (is currently the same as)
 * @example sjc ls containers --all
 * @example sjc ls apps (return all running apps)
 * @example sjc ls containers --target=stage (return all containers running on stage)
 * @example sjc ls containers --verbose (inlcude columns that are normally hidden)
 */

var scope = require('../../scope.js');
var isFlag = /^\-{1,2}\w+/;

if ( isFlag.test(scope.args[0]) || scope.args.length === 0 ) {
    scope.args.unshift('containers');
}

var subcommandName = scope.args.shift(),
    subcommand = require(__dirname + '/' + subcommandName);

module.exports = function(Command,scope) { return new Command(scope,subcommand); };