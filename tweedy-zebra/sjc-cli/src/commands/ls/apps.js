"use strict";

var d = require('../../docker-toolbox.js'),
    columnify = require('columnify'),
    colour = require('bash-color');

var run = function(good,bad) {
    d.getRunningApps(function(err,apps){
        if (err) {
            bad(err);
        } else {
            var cols = [], row, lines = {};
            Object.keys(apps).forEach(function(k){
                var thisapp = apps[k];
                var s1 = thisapp[0];
                row = {
                    project: s1.project,
                    appName: k,
                    branches: JSON.stringify(thisapp.map(function(a){ return a.branch; })),
                    services: JSON.stringify(thisapp.map(function(a){ return a.service; }).filter(function(s,n,arr){ return (arr.indexOf(s) === n); }))
                };
                cols.push(row);
            });
            Object.keys(row).forEach(function(k){
                lines[k] = colour.cyan('-'.repeat(Math.max(k.length,row[k].length)) + '  ');
            });
            cols.splice(0,0,lines);
            good( columnify(cols) );
        }
    });
};

module.exports = run;