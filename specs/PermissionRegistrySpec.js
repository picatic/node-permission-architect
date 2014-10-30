"use strict";

var PermissionRegistry = require('../lib/PermissionRegistry');
var PermissionProvider = require('../lib/PermissionProvider');
var Models = require('../lib/models');
var Errors = require('../lib/Errors');

describe("PermissionRegistry", function() {
  var permissionRegistry, securityRegistry, permissionProvider;

  beforeEach(function() {
    securityRegistry = {my_registry: 'yes', log: function() {}};
    permissionRegistry = new PermissionRegistry(securityRegistry);
  });

  describe('constructor' , function() {

    it("sets securityRegistry", function() {
      expect(permissionRegistry._securityRegistry).toBe(securityRegistry);
    });

    it('providers is empty object', function() {
      expect(permissionRegistry.providers).toEqual({});
    });
  });

  describe('register', function() {

    it("creates new entry for first new PermissionRegistry", function() {
      permissionProvider = new PermissionProvider('create', {}, securityRegistry);
      expect(permissionRegistry.providers.Event).toBe(undefined);
      permissionRegistry.register('Event', [permissionProvider]);
      expect(permissionRegistry.providers.Event).not.toBe(undefined);
      expect(permissionRegistry.providers.Event.create).toBe(permissionProvider);
    });

    it('adds new items to existing entry', function() {
      permissionProvider = new PermissionProvider('create', {}, securityRegistry);
      permissionRegistry.register('Event', [permissionProvider]);
      permissionProvider = new PermissionProvider('read', {}, securityRegistry);
      permissionRegistry.register('Event', [permissionProvider]);
      expect(permissionRegistry.providers.Event).not.toBe(undefined);
      expect(permissionRegistry.providers.Event.read).toBe(permissionProvider);
    });

    it('expects string resourceName', function() {
      var test = function() {
        permissionRegistry.register({}, []);
      };
      expect(test).toThrow('Expected resourceName to be string');
    });

    it('expects providers to be an Array', function() {
      var test = function() {
        permissionRegistry.register('Post', {});
      };
      expect(test).toThrow('Expected permissionProviders to be an Array');
    });
  });

  describe('permissionsForResource', function() {

    beforeEach(function() {
      permissionRegistry.register('Event', [
        new PermissionProvider('create', {}, securityRegistry), new PermissionProvider('update', {}, securityRegistry)]
      );
    });

    it('returns empty array with no matching Resource', function() {
      expect(permissionRegistry.permissionsForResource('DoesNotExist')).toEqual([]);
    });

    it('returns array of string names for permissions', function() {
      expect(permissionRegistry.permissionsForResource('Event')).toEqual(['create','update']);
    });
  });

  describe('providersForResource', function() {
    var create, update;
    beforeEach(function() {
      create = new PermissionProvider('create', {}, securityRegistry);
      update = new PermissionProvider('update', {}, securityRegistry);
      permissionRegistry.register('Event', [create, update]);
    });

    it('returns empty object for resource not present', function() {
      expect(permissionRegistry.providersForResource('NotPresent')).toEqual({});
    });

    it('returns keyed object of providers', function() {
      expect(permissionRegistry.providersForResource('Event')).toEqual({create: create, update: update});
    });
  });

  describe('getPermission', function() {
    var role, resource;

    beforeEach(function() {
      role = new Models.Role('admin');
      resource = new Models.Resource('Event', 1);
      permissionRegistry.register('Event', [
          new PermissionProvider('create', {
            getPermission: function(provider, role, resource, cb) {
              if (role.name === 'admin') {
                setImmediate(cb, null, new Models.Permission(true));
              } else {
                setImmediate(cb, null, new Models.Permission(false));
              }
            }
          },
          securityRegistry
          )
        ]
      );
    });

    it('returns error if permissionName is not string', function(done) {
      permissionRegistry.getPermission({}, {}, {}, function(err) {
        expect(err.message).toBe('Expected permissionName to be of type String');
        done();
      });
    });

    it('returns error if resource is not object', function(done) {
      permissionRegistry.getPermission('create', false, {}, function(err) {
        expect(err.message).toBe('Expected resource to be type of Object');
        done();
      });
    });

    it('returns error if role is not object', function(done) {
      permissionRegistry.getPermission('create', {}, false, function(err) {
        expect(err.message).toBe('Expected role to be type of Object');
        done();
      });
    });

    it('throws exception if cb is not function', function() {
      var test = function() {
        permissionRegistry.getPermission('create', {}, {}, {});
      };

      expect(test).toThrow('Expected cb to be type of function');
    });

    it('returns Error if no resource matches', function(done) {
      permissionRegistry.getPermission('update', new Models.Resource('Nope'), role, function(err, permission) {
        expect(err).not.toBe(null);
        expect(err instanceof Errors.PermissionArchitectPermissionProviderNotFound);
        expect(err.message).toBe('Could not find PermissionProvider for Resource: Nope');
        done();
      });
    });

    it('returns Permission instance', function(done) {
      permissionRegistry.getPermission('create', resource, role, function(err, permission) {
        expect(err).toBe(null);
        expect(permission instanceof Models.Permission).toBe(true);
        expect(permission.granted).toBe(true);
        done();
      });
    });

  });

});
