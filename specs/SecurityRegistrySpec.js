"use strict";

var SecurityRegistry = require('../lib/SecurityRegistry');
var Models = require('../lib/models');

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

  describe('roleFallback', function() {

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
});
