"use strict";

var CODE_GLOBS = ['src/**/*.js'];
var SPEC_GLOBS = ['test/**/*.test.js'];

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var packageJSON = require('./package.json');
var jasmine = require('gulp-jasmine');
var jscs = require('gulp-jscs');

gulp.task('lint', function(){
    gulp.src(CODE_GLOBS)
        .pipe(jshint(packageJSON.jshintConfig))
        .pipe(jshint.reporter('default', { verbose: false }))
        .pipe(jscs({
            "preset": "lint/jscs.javascript.node.json"
        }));
});

gulp.task('test',function(){
    gulp.src(SPEC_GLOBS).pipe(jasmine());
});

gulp.task('burp',function(){
   gulp.src(['test/commands/rot13.js','test/commands/weirdfacts.js']).pipe(jasmine()); 
});

gulp.task('default', ['lint', 'test']);
