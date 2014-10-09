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
      permissionProvider = new PermissionProvider('create');
    });

    it("set implemenation", function() {
      implementation = {my: 'provider'}
      permissionProvider.setImplementation(implementation);
      expect(permissionProvider.implementation).toBe(implementation);
    });
  });

  describe("getPermission", function() {
    var role = undefined;
    var resource = undefined;

    beforeEach(function() {
      role = {};
      resource = {};
      permissionProvider = new PermissionProvider('create');
    });

    it("defaults to default Permission", function() {
      permissionProvider.getPermission(role, resource, function(err, permission) {
        expect(err).toBe(null);
        expect(permission.granted).toBe(false);
        expect(permission.context).toBe(null);
        expect(permission.provider).toBe(permissionProvider);
      });
    });


  });
});
