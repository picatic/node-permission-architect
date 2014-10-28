"use strict";

var SecurityRegisty = require('../lib/SecurityRegistry');
var RoleProvider = require('../lib/RoleProvider');

describe("RoleProvider", function() {
  var securityRegistry;
  var roleProvider;

  beforeEach(function() {
    securityRegistry = SecurityRegisty.get();
  });

  describe("constructor", function() {

    it("sets names and implementation", function() {
      var implementation = {myImp: function() {}};
      roleProvider = new RoleProvider('Profile', 'Resource', implementation);
      expect(roleProvider.profileName).toBe('Profile');
      expect(roleProvider.resourceName).toBe('Resource');
      expect(roleProvider.implementation).toBe(implementation);
      expect(roleProvider._securityRegistry).toBe(null);
    });

    it('sets _securityRegistry', function() {
      roleProvider = new RoleProvider('Profile', 'Resource', null, securityRegistry);
      expect(roleProvider._securityRegistry).toBe(securityRegistry);
    });

    it('throws exception when profileName is not string', function() {
      var test = function() {
        new RoleProvider(false, false, {});
      };

      expect(test).toThrow('Expected profileName to be string');
    });

    it('throws exception when resourceName is not string', function() {
        var test = function() {
        new RoleProvider('test', false, {});
      };

      expect(test).toThrow('Expected resourceName to be string');
    });

  });

  it("setImplementation", function() {
    roleProvider = new RoleProvider('User', 'Event');
    var implementation = {allRoles: function() {}};
    roleProvider.setImplementation(implementation);
    expect(roleProvider.implementation).toBe(implementation);
  });

  it("getImplementation", function() {
    var implementation = {allRoles: function() {}};
    roleProvider = new RoleProvider('User', 'Event', implementation);
    expect(roleProvider.getImplementation()).toBe(implementation);
  });

  it('setSecurityRegistry', function() {
    var reg = {my: function() {}};
    roleProvider = new RoleProvider('User', 'Event', {});
    roleProvider.setSecurityRegistry(reg);
    expect(roleProvider.getSecurityRegistry()).toBe(reg);
  });

  it('getSecurityRegistry', function() {
    var reg = {my: function() {}};
    roleProvider = new RoleProvider('User', 'Event', {}, reg);
    expect(roleProvider.getSecurityRegistry()).toBe(reg);
  });

  describe("allRoles", function() {
    var profile, resource;

    beforeEach(function() {
      roleProvider = new RoleProvider('User', 'Event', {}, securityRegistry);
      profile = {};
      resource = {};
    });

    it('returns error if profile is not object', function(done) {
      roleProvider.allRoles(false, {}, function(err) {
        expect(err.message).toBe('Expected profile to be object');
        done();
      });
    });

    it('returns error if resource is not object', function(done) {
      roleProvider.allRoles({}, false, function(err) {
        expect(err.message).toBe('Expected resource to be object');
        done();
      });
    });

    it('throws exception if cb is not function', function() {
      var test = function() {
        roleProvider.allRoles({}, {}, {});
      };

      expect(test).toThrow('Expected cb to be function');
    });

    it("default pass-through", function(done) {
      roleProvider.allRoles(profile, resource, function(err, roles) {
        expect(err).toBe(null);
        expect(roles).toEqual([]);
        done();
      });
    });

    it("calls implementation.allRoles", function(done) {
      var implementation = {
        allRoles: function(provider, profile, resource, cb) {
          cb(null, [provider.getSecurityRegistry().buildRole('Test')]);
        }
      };
      spyOn(implementation, 'allRoles').andCallThrough();
      roleProvider.setImplementation(implementation);
      roleProvider.allRoles(profile, resource, function(err, roles) {
        expect(err).toBe(null);
        expect(roles[0].name).toEqual('Test');
        expect(implementation.allRoles).toHaveBeenCalledWith(roleProvider, profile, resource, jasmine.any(Function));
        done();
      });
    });

    it('returns error if allRoles implementation is not array', function(done) {
      var implementation = {
        allRoles: function(provider, profile, resource, cb) {
          cb(null, 'not an array');
        }
      };
      spyOn(implementation, 'allRoles').andCallThrough();
      roleProvider.setImplementation(implementation);
      roleProvider.allRoles(profile, resource, function(err, roles) {
        expect(err).not.toBe(null);
        expect(err.message).toBe('Expected roles returned by implementation.allRoles to be Array');
        done();
      });
    });

    it('returns error if implemenation results does not contain instances of Role', function(done) {
      var implementation = {
        allRoles: function(provider, profile, resource, cb) {
          cb(null, ['Test']);
        }
      };
      spyOn(implementation, 'allRoles').andCallThrough();
      roleProvider.setImplementation(implementation);
      roleProvider.allRoles(profile, resource, function(err, roles) {
        expect(err).not.toBe(null);
        expect(err.message).toBe('Expected roles array to contain Role instances');
        done();
      });
    });

  });

  describe("bestRole", function() {
    var profile, resource;

    beforeEach(function() {
      roleProvider = new RoleProvider('User', 'Event');
      profile = {};
      resource = {};
    });

   it('returns error if profile is not object', function(done) {
      roleProvider.bestRole(false, {}, function(err) {
        expect(err.message).toBe('Expected profile to be object');
        done();
      });
    });

    it('returns error if resource is not object', function(done) {
      roleProvider.bestRole({}, false, function(err) {
        expect(err.message).toBe('Expected resource to be object');
        done();
      });
    });

    it('throws exception if cb is not function', function() {
      var test = function() {
        roleProvider.bestRole({}, {}, {});
      };

      expect(test).toThrow('Expected cb to be function');
    });

    it("default pass-through", function(done) {
      spyOn(roleProvider,'allRoles').andCallThrough();
      roleProvider.bestRole(profile, resource, function(err, role) {
        expect(err).toBe(null);
        expect(role).toEqual(null);
        expect(roleProvider.allRoles).toHaveBeenCalledWith(profile, resource, jasmine.any(Function));
        done();
      });
    });

    it("calls implementation.bestRole", function(done) {
      var implementation = {
        bestRole: function(provider, profile, resource, cb) {
          cb(null, 'Test');
        }
      };
      spyOn(implementation, 'bestRole').andCallThrough();
      roleProvider.setImplementation(implementation);
      roleProvider.bestRole(profile, resource, function(err, role) {
        expect(err).toBe(null);
        expect(role).toEqual('Test');
        expect(implementation.bestRole).toHaveBeenCalledWith(roleProvider, profile, resource, jasmine.any(Function));
        done();
      });
    });

  });

});
