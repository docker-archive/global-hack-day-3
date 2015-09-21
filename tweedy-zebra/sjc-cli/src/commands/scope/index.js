"use strict";

var run = function(good,bad) {
    var scope = this;
    this.enhance(function(err,newscope){
        good(newscope);
    });
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};