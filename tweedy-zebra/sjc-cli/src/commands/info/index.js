"use strict";

/**
 * reads appdef and returns it. First uses scope's "enhance" method to learn about the current repo and appdef
 * @returns {String} the contents of appdef.json, or an error if the current dir is not a git repo, or does not have an appdef file
 * @example sjc info (from the root of a repo containing an appdef.json file)
 * @example sjc info (from anywhere else)
 */

module.exports = function(Command,scope) { 
    return new Command(scope,function(good,bad){
        scope.enhance(function(err,newcope) {
            if (err) {
                bad(err);  
            } else {
                good(scope);    
            }
        });
    });
};
