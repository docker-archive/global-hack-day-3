'use strict';

/**
 * @ngdoc filter
 * @name emeraldApp.filter:buildResultFilter
 * @function
 * @description
 * # buildResultFilter
 * Filter in the emeraldApp.
 */
angular.module('emeraldApp')
  .filter('buildResultFilter', function () {
    return function (input) {
      return {
        "passed": "success",
        "failed": "danger"
      }[input] || "default";
    };
  });
