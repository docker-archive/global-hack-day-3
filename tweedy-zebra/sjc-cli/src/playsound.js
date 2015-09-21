"use strict";

/**
 * play a sound in a detached process, but fail silently if you can't
 * completely ignores stout and stderr
 * @returns { nothing } undefined
 */

var spawn = require('child_process').spawn,
    scope = require('./scope.js');
const CLIP_ROOT = __dirname + '/assets/';

var darwinParams = function(clip_path) {
    var command = '/usr/bin/env';
    var args = ['afplay','-v','0.2',clip_path + '.mp3'];
    var options = {
        stdio: ['ignore','ignore','ignore'],
        detached: true
    };
    var r = {};
    r.command = command;
    r.args  = args;
    r.options = options;
    return r;
};

var ubuntuParams = function(clip_path) {
    var command = '/usr/bin/env';
    var args = ['aplay',clip_path + '.wav'];
    var options = {
        stdio: ['ignore','ignore','ignore'],
        detached: true
    };
    var r = {};
    r.command = command;
    r.args  = args;
    r.options = options;
    return r;
};

var playsound = function(clipname){
    var clip_path = CLIP_ROOT + clipname;
    var params = {};
    switch (process.platform.toLowerCase()) {
        case 'linux':
        params = ubuntuParams(clip_path);
        break;
        default:
        params = darwinParams(clip_path);
        break;
    }
    var clip = spawn(params.command,params.args,params.options);
    clip.unref();
    return;
};

module.exports = playsound;
