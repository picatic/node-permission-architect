"use strict";

var SessionRegistry = require('../lib/SessionRegistry');
var Models = require('../lib/models');
var PermissionProvider = require('../lib/PermissionProvider');
var PermissionRegistry = require('../lib/PermissionRegistry');
var Errors = require('../lib/Errors');

describe("SessionRegistry", function() {
  var sessionRegistry;

  beforeEach(function() {
    sessionRegistry = SessionRegistry.get();
  });

  afterEach(function() {
    SessionRegistry.remove('__default__');
  });

  it("Provides default instance", function() {
    expect(sessionRegistry.name).toBe('__default__');
  });

  it('instance has Models', function() {
    expect(sessionRegistry.Models).not.toBeUndefined();
  });

  describe('Role fallback', function() {

    it('default fallback is guest Role', function() {
      expect(sessionRegistry._fallbackRole instanceof Models.Role).toBe(true);
      expect(sessionRegistry._fallbackRole.name).toBe('guest');
    });

    it('setFallback', function() {
      var role = new Models.Role('test');
      sessionRegistry.setFallbackRole(role);
      expect(sessionRegistry._fallbackRole).toBe(role);
    });

    it('getFallback', function() {
      var role = new Models.Role('test');
      sessionRegistry.setFallbackRole(role);
      expect(sessionRegistry.getFallbackRole()).toBe(role);
    });
  });

  describe('Permission fallback', function() {
    it('default fallback is empty Permission', function() {
      expect(sessionRegistry._fallbackPermission instanceof Models.Permission).toBe(true);
      expect(sessionRegistry._fallbackPermission).toEqual(new Models.Permission());
    });

    it('setFallback', function() {
      var permission = new Models.Permission(true, {});
      sessionRegistry.setFallbackPermission(permission);
      expect(sessionRegistry._fallbackPermission).toBe(permission);
    });

    it('getFallback', function() {
      var permission = new Models.Permission(true, {});
      sessionRegistry.setFallbackPermission(permission);
      expect(sessionRegistry.getFallbackPermission()).toBe(permission);
    });
  });

  describe('logger', function() {
    var logger = null;

    beforeEach(function() {
      logger = {
        info: function() {}
      };
    });

    it('default to null', function() {
      expect(sessionRegistry._logger).toBe(null);
    });

    it('setLogger', function() {
      sessionRegistry.setLogger(logger);
      expect(sessionRegistry._logger).toBe(logger);
    });

    it('getLogger', function() {
      sessionRegistry.setLogger(logger);
      expect(sessionRegistry.getLogger()).toBe(logger);
    });
  });

  describe('log', function() {
    var logger = null;

    beforeEach(function() {
      logger = {
        info: function() {}
      };
    });

    it('calls _logger with first param as method and additional params passed along', function() {
      sessionRegistry.setLogger(logger);
      spyOn(logger, 'info').andCallThrough();
      sessionRegistry.log('info', 'My string %s', 'a');
      expect(logger.info).toHaveBeenCalledWith('My string %s', 'a');
    });

    it('does not call non-existant levels', function() {
      sessionRegistry.setLogger(logger);
      var test = function() {
        sessionRegistry.log('madeup', 'My string %s', 'a');
      };
      expect(test).not.toThrow();
    });
  });

  describe('cache', function() {

    it('has not cache by default', function() {
      expect(sessionRegistry._cache).toBe(null);
    });

    it('enableCache sets _cache', function() {
      sessionRegistry.enableCache();
      expect(sessionRegistry._cache).not.toBe(null);
    });
  });

  describe("getRoleProviderRegistry", function() {
    var instance;
    beforeEach(function() {
      instance = sessionRegistry.getRoleProviderRegistry();
    });

    it("returns instance of getRoleProviderRegistry", function() {
      expect(instance).toEqual(jasmine.any(Object));
      expect(instance.constructor.name).toBe('RoleProviderRegistry');
    });

    it("is same instance each time", function() {
      var secondInstance = sessionRegistry.getRoleProviderRegistry();
      expect(secondInstance).toEqual(instance);
    });
  });

  describe("buildResource", function() {
    var instance;

    beforeEach(function() {
      instance = sessionRegistry.buildResource("Name", "id", {my: "config"});
    });

    it("returns instance of Resource", function() {
      expect(instance.constructor.name).toBe('Resource');
    });

    it("name and id set", function() {
      expect(instance.name).toBe("Name");
      expect(instance.identifier).toBe("id");
    });

    it("context is set", function() {
      expect(instance.getContext()).toEqual({my: "config"});
    });
  });

  describe("buildProfile", function() {
    var instance;

    beforeEach(function() {
      instance = sessionRegistry.buildProfile("Name", "id", {my: "config"});
    });

    it("returns instance of Profile", function() {
      expect(instance.constructor.name).toBe('Profile');
    });

    it("name and id set", function() {
      expect(instance.name).toBe("Name");
      expect(instance.identifier).toBe("id");
    });

    it("context is set", function() {
      expect(instance.getContext()).toEqual({my: "config"});
    });
  });

  describe("buildRoleProvider", function() {
    var instance, implementation;

    beforeEach(function() {
      implementation = {my: 'implementation'};
      instance = sessionRegistry.buildRoleProvider("ProfileName", "ResourceName", implementation);
    });

    it("returns instance of RoleProvider", function() {
      expect(instance.constructor.name).toBe('RoleProvider');
    });

    it("profileName and resourceName set", function() {
      expect(instance.profileName).toBe("ProfileName");
      expect(instance.resourceName).toBe("ResourceName");
    });

    it("implementation is set", function() {
      expect(instance.getImplementation()).toEqual(implementation);
    });

    it('sets sessionRegistry', function() {
      expect(instance.getSessionRegistry()).toEqual(sessionRegistry);
    });
  });

  describe("registerRoleProvider", function() {
    var roleProvider, roleProviderRegistry;

    beforeEach(function() {
      roleProvider = sessionRegistry.buildRoleProvider("ProfileName", "ResourceName", {my: "config"});
      roleProviderRegistry = sessionRegistry.getRoleProviderRegistry();
    });

    it("registers roleProvider", function() {
      spyOn(roleProviderRegistry,'register').andCallFake(function() {});
      sessionRegistry.registerRoleProvider(roleProvider);
      expect(roleProviderRegistry.register).toHaveBeenCalledWith(roleProvider);
    });
  });

  describe('resourcesForProfile', function() {
    var roleProviderRegistry;
    it('calls forProfile on RoleProviderRegistry', function() {
      roleProviderRegistry = sessionRegistry.getRoleProviderRegistry();
      spyOn(roleProviderRegistry, 'forProfile').andCallThrough();
      sessionRegistry.resourcesForProfile('User');
      expect(roleProviderRegistry.forProfile).toHaveBeenCalled();
    });
  });

  describe('profilesForResource', function() {
    var roleProviderRegistry;
    it('calls forResource on RoleProviderRegistry', function() {
      roleProviderRegistry = sessionRegistry.getRoleProviderRegistry();
      spyOn(roleProviderRegistry, 'forResource').andCallThrough();
      sessionRegistry.profilesForResource('Event');
      expect(roleProviderRegistry.forResource).toHaveBeenCalled();
    });
  });

  describe('buildPermissionProvider', function() {

    var instance, implementation;

    beforeEach(function() {
      implementation = {my: 'implementation'};
      instance = sessionRegistry.buildPermissionProvider("create", implementation);
    });

    it("returns instance of PermissionProvider", function() {
      expect(instance.constructor.name).toBe('PermissionProvider');
      expect(instance instanceof PermissionProvider).toBe(true);
    });

    it("name set", function() {
      expect(instance.name).toBe("create");
    });

    it("implementation is set", function() {
      expect(instance.getImplementation()).toEqual(implementation);
    });
  });

  describe('getPermissionRegistry', function() {
    var instance;
    beforeEach(function() {
      instance = sessionRegistry.getPermissionRegistry();
    });

    it("returns instance of PermissionRegistry", function() {
      expect(instance instanceof PermissionRegistry).toBe(true);
    });

    it('sets sessionRegistry from constructor', function() {
      expect(instance._sessionRegistry).toBe(sessionRegistry);
    });

    it("is same instance each time", function() {
      var secondInstance = sessionRegistry.getPermissionRegistry();
      expect(secondInstance).toEqual(instance);
    });

  });

  describe('registerPermissionProviders', function() {
    var instance, implementation;

    beforeEach(function() {
      implementation = {my: 'implementation'};
      instance = sessionRegistry.buildPermissionProvider("create", implementation);
    });

    it('calls register on PermissionProvider', function() {
      spyOn(sessionRegistry.getPermissionRegistry(), 'register').andCallThrough();
      sessionRegistry.registerPermissionProviders('Event', [instance]);
      expect(sessionRegistry.getPermissionRegistry().register).toHaveBeenCalledWith('Event', [instance]);
    });

  });

  describe('lookupRoleProvider', function() {

    it('calls lookup on RoleProviderRegister', function() {
      var profile = new Models.Profile('User', 1);
      var resource = new Models.Resource('Page', 3);

      spyOn(sessionRegistry.getRoleProviderRegistry(), 'lookup').andCallThrough();
      sessionRegistry.lookupRoleProvider(profile, resource);
      expect(sessionRegistry.getRoleProviderRegistry().lookup).toHaveBeenCalledWith(profile.name, resource.name);
    });
  });

  describe('rolesFor', function() {
    var profile, resource;

    beforeEach(function() {
      profile = new Models.Profile('User', 1);
      resource = new Models.Resource('Page', 2);
    });

    it('returns fallback role if no RoleProvider found', function(done) {
      sessionRegistry.rolesFor(profile, resource, function(err, role) {
        expect(err).toBe(null);
        expect(role).toEqual([sessionRegistry.getFallbackRole()]);
        done();
      });
    });

    it('returns role provided from RoleProvider', function(done) {
      var roleProvider = sessionRegistry.buildRoleProvider('User', 'Page', {
        allRoles: function(provider, profile, resource, cb) {
          setImmediate(cb, null, [provider.getSessionRegistry().buildRole('admin')]);
        }
      });
      sessionRegistry.registerRoleProvider(roleProvider);
      sessionRegistry.rolesFor(profile, resource, function(err, roles) {
        expect(err).toBe(null);
        expect(roles[0].name).toEqual('admin');
        done();
      });
    });
  });

  describe('bestRoleFor', function() {
    var profile, resource;

    beforeEach(function() {
      profile = new Models.Profile('User', 1);
      resource = new Models.Resource('Page', 2);
    });

    it('returns fallback role if no RoleProvider found', function(done) {
      sessionRegistry.bestRoleFor(profile, resource, function(err, role) {
        expect(err).toBe(null);
        expect(role).toEqual(sessionRegistry.getFallbackRole());
        done();
      });
    });

    it('returns role provided from RoleProvider', function(done) {
      var roleProvider = sessionRegistry.buildRoleProvider('User', 'Page', {
        bestRole: function(provider, profile, resource, cb) {
          setImmediate(cb, null, provider.getSessionRegistry().buildRole('admin'));
        }
      });
      sessionRegistry.registerRoleProvider(roleProvider);
      sessionRegistry.bestRoleFor(profile, resource, function(err, role) {
        expect(err).toBe(null);
        expect(role.name).toEqual('admin');
        done();
      });
    });

    describe("with cache", function() {
      
      beforeEach(function() {
        sessionRegistry.enableCache();
        var roleProvider = sessionRegistry.buildRoleProvider('User', 'Page', {
          bestRole: function(provider, profile, resource, cb) {
            setImmediate(cb, null, provider.getSessionRegistry().buildRole('admin'));
          }
        });
        sessionRegistry.registerRoleProvider(roleProvider);
      });

      it('sets cache key', function(done) {
        sessionRegistry.bestRoleFor(profile, resource, function(err, role) {
          sessionRegistry._cache.get("bestRoleFor[Profile[User][1]Resource[Page][2]]", function(err, val) {
            expect(val['bestRoleFor[Profile[User][1]Resource[Page][2]]']).toBe(role);
            done();
          });
        });
      });
    });
  });

  describe('getPermission', function() {
    var role, resource, permissionProvider;

    beforeEach(function() {
      role = new Models.Role('admin');
      resource = sessionRegistry.buildResource('Event', 1, {});
      permissionProvider = sessionRegistry.buildPermissionProvider('create');
      sessionRegistry.registerPermissionProviders('Event', [permissionProvider]);
    });

    it('calls getPermission on PermissionResgitry', function(done) {
      spyOn(sessionRegistry.getPermissionRegistry(), 'getPermission').andCallThrough();
      sessionRegistry.getPermission('create', resource, role, function(err, permission) {
        expect(sessionRegistry.getPermissionRegistry().getPermission).toHaveBeenCalledWith('create', resource, role, jasmine.any(Function));
        done();
      });
    });

  });

  describe('buildRole', function() {

    it('creates instance of Role', function() {
      var role = sessionRegistry.buildRole('admin');
      expect(role instanceof Models.Role).toBe(true);
    });
  });

  describe('buildPermission', function() {

    it('creates instance of Permission', function() {
      var permission = sessionRegistry.buildPermission(true, {my:'context'}, {provider:'magic'});
      expect(permission instanceof Models.Permission).toBe(true);
    });
  });
});
