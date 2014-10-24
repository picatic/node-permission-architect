"use strict";

var SecurityRegistry = require('../lib/SecurityRegistry');
var Models = require('../lib/models');
var PermissionProvider = require('../lib/PermissionProvider');
var PermissionRegistry = require('../lib/PermissionRegistry');
var Errors = require('../lib/Errors');

describe("SecurityRegistry", function() {
  var securityRegistry;

  beforeEach(function() {
    securityRegistry = SecurityRegistry.get();
  });

  afterEach(function() {
    SecurityRegistry.remove('__default__');
  });

  it("Provides default instance", function() {
    expect(securityRegistry.name).toBe('__default__');
  });

  it('instance has Models', function() {
    expect(securityRegistry.Models).not.toBeUndefined();
  });

  describe('Role fallback', function() {

    it('default fallback is empty Role', function() {
      expect(securityRegistry._fallbackRole instanceof Models.Role).toBe(true);
      expect(securityRegistry._fallbackRole.name).toBeUndefined();
    });

    it('setFallback', function() {
      var role = new Models.Role('test');
      securityRegistry.setFallbackRole(role);
      expect(securityRegistry._fallbackRole).toBe(role);
    });

    it('getFallback', function() {
      var role = new Models.Role('test');
      securityRegistry.setFallbackRole(role);
      expect(securityRegistry.getFallbackRole()).toBe(role);
    });
  });

  describe('Permission fallback', function() {
    it('default fallback is empty Permission', function() {
      expect(securityRegistry._fallbackPermission instanceof Models.Permission).toBe(true);
      expect(securityRegistry._fallbackPermission).toEqual(new Models.Permission());
    });

    it('setFallback', function() {
      var permission = new Models.Permission(true, {});
      securityRegistry.setFallbackPermission(permission);
      expect(securityRegistry._fallbackPermission).toBe(permission);
    });

    it('getFallback', function() {
      var permission = new Models.Permission(true, {});
      securityRegistry.setFallbackPermission(permission);
      expect(securityRegistry.getFallbackPermission()).toBe(permission);
    });
  });

  describe("getRoleProviderRegistry", function() {
    var instance;
    beforeEach(function() {
      instance = securityRegistry.getRoleProviderRegistry();
    });

    it("returns instance of getRoleProviderRegistry", function() {
      expect(instance).toEqual(jasmine.any(Object));
      expect(instance.constructor.name).toBe('RoleProviderRegistry');
    });

    it("is same instance each time", function() {
      var secondInstance = securityRegistry.getRoleProviderRegistry();
      expect(secondInstance).toEqual(instance);
    });
  });

  describe("buildResource", function() {
    var instance;

    beforeEach(function() {
      instance = securityRegistry.buildResource("Name", "id", {my: "config"});
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
      instance = securityRegistry.buildProfile("Name", "id", {my: "config"});
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
      instance = securityRegistry.buildRoleProvider("ProfileName", "ResourceName", implementation);
    });

    it("returns instance of RoleProvider", function() {
      expect(instance.constructor.name).toBe('RoleProvider');
    });

    it("profileName and resourceName set", function() {
      expect(instance.profileName).toBe("ProfileName");
      expect(instance.resourceName).toBe("ResourceName");
    });

    it("config is set", function() {
      expect(instance.getImplementation()).toEqual(implementation);
    });
  });

  describe("registerRoleProvider", function() {
    var roleProvider, roleProviderRegistry;

    beforeEach(function() {
      roleProvider = securityRegistry.buildRoleProvider("ProfileName", "ResourceName", {my: "config"});
      roleProviderRegistry = securityRegistry.getRoleProviderRegistry();
    });

    it("registers roleProvider", function() {
      spyOn(roleProviderRegistry,'register').andCallFake(function() {});
      securityRegistry.registerRoleProvider(roleProvider);
      expect(roleProviderRegistry.register).toHaveBeenCalledWith(roleProvider);
    });
  });

  describe('resourcesForProfile', function() {
    var roleProviderRegistry;
    it('calls forProfile on RoleProviderRegistry', function() {
      roleProviderRegistry = securityRegistry.getRoleProviderRegistry();
      spyOn(roleProviderRegistry, 'forProfile').andCallThrough();
      securityRegistry.resourcesForProfile('User');
      expect(roleProviderRegistry.forProfile).toHaveBeenCalled();
    });
  });

  describe('profilesForResource', function() {
    var roleProviderRegistry;
    it('calls forResource on RoleProviderRegistry', function() {
      roleProviderRegistry = securityRegistry.getRoleProviderRegistry();
      spyOn(roleProviderRegistry, 'forResource').andCallThrough();
      securityRegistry.profilesForResource('Event');
      expect(roleProviderRegistry.forResource).toHaveBeenCalled();
    });
  });

  describe('buildPermissionProvider', function() {

    var instance, implementation;

    beforeEach(function() {
      implementation = {my: 'implementation'};
      instance = securityRegistry.buildPermissionProvider("create", implementation);
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
      instance = securityRegistry.getPermissionRegistry();
    });

    it("returns instance of PermissionRegistry", function() {
      expect(instance instanceof PermissionRegistry).toBe(true);
    });

    it("is same instance each time", function() {
      var secondInstance = securityRegistry.getPermissionRegistry();
      expect(secondInstance).toEqual(instance);
    });

  });

  describe('registerPermissionProviders', function() {
    var instance, implementation;

    beforeEach(function() {
      implementation = {my: 'implementation'};
      instance = securityRegistry.buildPermissionProvider("create", implementation);
    });

    it('calls register on PermissionProvider', function() {
      spyOn(securityRegistry.getPermissionRegistry(), 'register').andCallThrough();
      securityRegistry.registerPermissionProviders('Event', [instance]);
      expect(securityRegistry.getPermissionRegistry().register).toHaveBeenCalledWith('Event', [instance]);
    });

  });

  describe('rolesFor', function() {
    var profile, resource;

    beforeEach(function() {
      profile = new Models.Profile('User', 1);
      resource = new Models.Resource('Page', 2);
    });

    it('returns fallback role if no RoleProvider found', function(done) {
      securityRegistry.rolesFor(profile, resource, function(err, role) {
        expect(err).toBe(null);
        expect(role).toEqual([securityRegistry.getFallbackRole()]);
        done();
      });
    });

    it('returns fallback role if RoleProvider returns null', function(done) {
      var roleProvider = securityRegistry.buildRoleProvider('User', 'Page', {
        allRoles: function(provider, profile, resource, cb) {
          setImmediate(cb, null, null);
        }
      });
      securityRegistry.registerRoleProvider(roleProvider);
      securityRegistry.rolesFor(profile, resource, function(err, role) {
        expect(err).toBe(null);
        expect(role).toEqual([securityRegistry.getFallbackRole()]);
        done();
      });
    });

    it('returns role provided from RoleProvider', function(done) {
      var roleProvider = securityRegistry.buildRoleProvider('User', 'Page', {
        allRoles: function(provider, profile, resource, cb) {
          setImmediate(cb, null, ['admin']);
        }
      });
      securityRegistry.registerRoleProvider(roleProvider);
      securityRegistry.rolesFor(profile, resource, function(err, role) {
        expect(err).toBe(null);
        expect(role).toEqual(['admin']);
        done();
      });
    });
  });

  describe('getPermission', function() {
    var role, resource, permissionProvider;

    beforeEach(function() {
      role = new Models.Role('admin');
      resource = securityRegistry.buildResource('Event', 1, {});
      permissionProvider = securityRegistry.buildPermissionProvider('create');
      securityRegistry.registerPermissionProviders('Event', [permissionProvider]);
    });

    it('calls getPermission on PermissionResgitry', function(done) {
      spyOn(securityRegistry.getPermissionRegistry(), 'getPermission').andCallThrough();
      securityRegistry.getPermission('create', role, resource, function(err, permission) {
        expect(securityRegistry.getPermissionRegistry().getPermission).toHaveBeenCalledWith('create', role, resource, jasmine.any(Function));
        done();
      });
    });

  });

  describe('buildRole', function() {

    it('creates instance of Role', function() {
      var role = securityRegistry.buildRole('admin');
      expect(role instanceof Models.Role).toBe(true);
    });
  });

  describe('buildPermission', function() {

    it('creates instance of Permission', function() {
      var permission = securityRegistry.buildPermission(true, {my:'context'}, {provider:'magic'});
      expect(permission instanceof Models.Permission).toBe(true);
    });
  });
});
