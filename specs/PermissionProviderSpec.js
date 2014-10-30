"use strict";

var SecurityRegistry = require('../lib/SecurityRegistry');
var PermissionProvider = require('../lib/PermissionProvider');

describe("PermissionProvider", function() {
  var permissionProvider;
  var securityRegistry;

  beforeEach(function() {
    securityRegistry = SecurityRegistry.get();
  });

  describe("constructor", function() {

    beforeEach(function() {
      permissionProvider = new PermissionProvider('create', {}, {});
    });

    it('throws exception when name is not string', function() {
      var test = function() {
        new PermissionProvider(false, {}, {});
      };

      expect(test).toThrow('Expected name to be string');
    });

    it('throws exception when securityRegistry is not object', function() {
      var test = function() {
        new PermissionProvider('create', {}, false);
      };

      expect(test).toThrow('Expected securityRegistry to be object');
    });

    it("sets name", function() {
      expect(permissionProvider.name).toBe('create');
    });

    it("default implementation", function() {
      expect(permissionProvider.implementation).toEqual({});
    });

    it('sets _securityRegistry', function() {
      var securityRegistry = {sec: true};
      permissionProvider = new PermissionProvider('create', {}, securityRegistry);
      expect(permissionProvider._securityRegistry).toBe(securityRegistry);
    });


  });

  describe("setImplementation", function() {
    beforeEach(function() {
      permissionProvider = new PermissionProvider('create', {}, {});
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
      permissionProvider = new PermissionProvider('create', implementation, {});
    });

    it("get implemenation", function() {
      expect(permissionProvider.getImplementation()).toBe(implementation);
    });
  });

  describe("setSecurityRegistry", function() {
    beforeEach(function() {
      permissionProvider = new PermissionProvider('create', {}, {});
    });

    it("set implemenation", function() {
      var securityRegistry = {my: 'provider'};
      permissionProvider.setSecurityRegistry(securityRegistry);
      expect(permissionProvider._securityRegistry).toBe(securityRegistry);
    });
  });

  describe('getSecurityRegistry', function() {
    var securityRegistry;
    beforeEach(function() {
      securityRegistry = {my: 'test'};
      permissionProvider = new PermissionProvider('create', {}, securityRegistry);
    });

    it("get implemenation", function() {
      expect(permissionProvider.getSecurityRegistry()).toBe(securityRegistry);
    });
  });

  describe('getPermission', function() {
    var role, resource;

    beforeEach(function() {
      role = {};
      resource = {};
      permissionProvider = new PermissionProvider('create', {}, securityRegistry);
    });

    it('returns error if role is not object', function(done) {
      permissionProvider.getPermission(false, {}, function(err) {
        expect(err.message).toBe('Expected role to be object');
        done();
      });
    });

    it('returns error if resource is not object', function(done) {
      permissionProvider.getPermission({}, false, function(err) {
        expect(err.message).toBe('Expected resource to be object');
        done();
      });
    });

    it('throw error if cb is not function', function() {
      var test = function() {
        permissionProvider.getPermission({}, {}, false);
      };

      expect(test).toThrow('Expected cb to be function');
    });

    it('defaults to default Permission', function(done) {
      permissionProvider.getPermission(role, resource, function(err, permission) {
        expect(err).toBe(null);
        expect(permission.granted).toBe(false);
        expect(permission.context).toBe(null);
        expect(permission.provider).toBe(permissionProvider);
        done();
      });
    });

    it('calls implementation when set', function(done) {
      var implementation = {
        getPermission: function(provider, role, resource, cb) {
          cb(null, null);
        }
      };
      permissionProvider.setImplementation(implementation);
      spyOn(implementation, 'getPermission').andCallThrough();
      permissionProvider.getPermission(role, resource, function(err, permission) {
        expect(implementation.getPermission).toHaveBeenCalledWith(permissionProvider, role, resource, jasmine.any(Function));
        done();
      });
    });


  });
});
