var SecurityRegistry = require('../lib/SecurityRegistry');

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
    var instance;

    beforeEach(function() {
      instance = securityRegistry.buildRoleProvider("ProfileName", "ResourceName", {my: "config"});
    });

    it("returns instance of RoleProvider", function() {
      expect(instance.constructor.name).toBe('RoleProvider');
    });

    it("profileName and resourceName set", function() {
      expect(instance.profileName).toBe("ProfileName");
      expect(instance.resourceName).toBe("ResourceName");
    });

    it("config is set", function() {
      expect(instance.config).toEqual({my: "config"});
    });
  });

  describe("registerRoleProvider", function() {
    var roleProvider;

    beforeEach(function() {
      roleProvider = securityRegistry.buildRoleProvider("ProfileName", "ResourceName", {my: "config"});
    });

    it("registeres roleProvider", function() {
      spyOn(securityRegistry.getRoleProviderRegistry(),'register').andCallFake();
      securityRegistry.registerRoleProvider(roleProvider);
      expect(securityRegistry.getRoleProviderRegistry().register).toHaveBeenCalledWith(roleProvider);
    });
  });
});
