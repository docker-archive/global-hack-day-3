"use strict";

/**
 * An example command, to get you going
 * @arg {Command} Command - The command constructor function, which cli.js passed in
 * @arg {Object} scope - an object containing args, commandName, and conf (commandline arguments, configuration settings, and the current command's name)
 * @returns (Function) - new Command
 * @example: sjc example hello world
 * @example: sjc throw
 */

var run = function(good,bad) {

    /**
     * this performs our main logic. when we passed `scope` in, it attached to `this`
     * good is a callback function for when things turned out ok
     * bad is it's evil twin
     */

     var scope = this;

    if ( scope.args[0] === 'throw' ) {
        bad('i am throwing an error');
    } else {
        //  let's show the user everything in run's scope, which we bound to "this"
        good(scope);
    }
};


module.exports = function(Command,scope) {

    /**
     * Command is the Command.js constructor
     * scope is an object made up of data we think the command might need.
     * we can modify it as desired. ex:
     */

    scope.userPreferences = {
        favouriteColour: 'blue'
    };
    scope.conf.soundEffects.volume = 0.5;

    return new Command(scope,run);
};
