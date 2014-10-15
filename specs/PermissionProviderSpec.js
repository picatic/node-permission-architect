"use strict";

var PermissionProvider = require('../lib/PermissionProvider');

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
      var implementation = {my: 'provider'};
      permissionProvider.setImplementation(implementation);
      expect(permissionProvider.implementation).toBe(implementation);
    });
  });

  describe('getImplementation', function() {
    var implementation;
    beforeEach(function() {
      implementation = {my: 'test'};
      permissionProvider = new PermissionProvider('create', implementation);
    });

    it("get implemenation", function() {
      expect(permissionProvider.getImplementation()).toBe(implementation);
    });
  });

  describe("getPermission", function() {
    var role, resource;

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
