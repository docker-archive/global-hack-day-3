'use strict';

describe('Filter: buildResultFilter', function () {

  // load the filter's module
  beforeEach(module('emeraldApp'));

  // initialize a new instance of the filter before each test
  var buildResultFilter;
  beforeEach(inject(function ($filter) {
    buildResultFilter = $filter('buildResultFilter');
  }));

  it('should return the input prefixed with "buildResultFilter filter:"', function () {
    var text = 'angularjs';
    expect(buildResultFilter(text)).toBe('buildResultFilter filter: ' + text);
  });

});
