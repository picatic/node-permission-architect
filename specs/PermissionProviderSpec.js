"use strict"

PermissionProvider = require('../lib/PermissionProvider');

describe("PermissionProvider", function() {
  var permissionProvider;

  describe("constructor", function() {

    beforeEach(function() {
      permissionProvider = new PermissionProvider('create');
    });

    it("sets name", function() {
      expect(permissionProvider.name).toBe('create');
    });

    it("implementation", function() {
      expect(permissionProvider.implementation).toEqual({});
    });
  });

  describe("setImplementation", function() {
    beforeEach(function() {
      permissionProvider = new PermissionProvider('Event');
    });

    it("set implemenation", function() {
      implementation = {my: 'provider'}
      permissionProvider.setImplementation(implementation);
      expect(permissionProvider.implementation).toBe(implementation);
    });
  });
});
