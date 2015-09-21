'use strict';

describe('Controller: ListUserCtrl', function () {

  // load the controller's module
  beforeEach(module('DockerizeApp'));

  var ListUserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListUserCtrl = $controller('ListUserCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.forUnitTest).toBe(true);
  });
});
