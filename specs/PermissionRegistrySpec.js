"use strict"

var PermissionRegistry = require('../lib/PermissionRegistry');
var PermissionProvider = require('../lib/PermissionProvider');

describe("PermissionRegistry", function() {
  var permissionRegistry = undefined;
  var securityRegistry = undefined;
  var permissionProvider = undefined;
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
