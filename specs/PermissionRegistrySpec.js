"use strict";

var PermissionRegistry = require('../lib/PermissionRegistry');
var PermissionProvider = require('../lib/PermissionProvider');
var Models = require('../lib/models');
var Errors = require('../lib/Errors');

describe("PermissionRegistry", function() {
  var permissionRegistry, securityRegistry, permissionProvider;

  beforeEach(function() {
    securityRegistry = {my_registry: 'yes'};
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
      permissionProvider = new PermissionProvider('create');
      expect(permissionRegistry.providers.Event).toBe(undefined);
      permissionRegistry.register('Event', [permissionProvider]);
      expect(permissionRegistry.providers.Event).not.toBe(undefined);
      expect(permissionRegistry.providers.Event.create).toBe(permissionProvider);
    });

    it('adds new items to existing entry', function() {
      permissionProvider = new PermissionProvider('create');
      permissionRegistry.register('Event', [permissionProvider]);
      permissionProvider = new PermissionProvider('read');
      permissionRegistry.register('Event', [permissionProvider]);
      expect(permissionRegistry.providers.Event).not.toBe(undefined);
      expect(permissionRegistry.providers.Event.read).toBe(permissionProvider);
    });
  });

  describe('permissionsForResource', function() {

    beforeEach(function() {
      permissionRegistry.register('Event', [
        new PermissionProvider('create'), new PermissionProvider('update')]
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
      create = new PermissionProvider('create');
      update = new PermissionProvider('update');
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
            getPermission: function(role, resource, cb) {
              if (role.name === 'admin') {
                setImmediate(cb, null, new Models.Permission(true));
              } else {
                setImmediate(cb, null, new Models.Permission(false));
              }
            }
          })
        ]
      );
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

    it('calls implementation with scope of PermissionProvider', function(done) {
       permissionRegistry.register('Event', [
          new PermissionProvider('update', {
            getPermission: function(role, resource, cb) {
              if (this.name === 'update') {
                setImmediate(cb, null, new Models.Permission(true));
              } else {
                setImmediate(cb, null, new Models.Permission(false));
              }
            }
          })
        ]
      );
      permissionRegistry.getPermission('update', resource, role, function(err, permission) {
        expect(permission.granted).toBe(true);
        done();
      });
    });
  });

});
