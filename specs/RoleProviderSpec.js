"use strict";

describe("RoleProvider", function() {
  var RoleProvider = require('../lib/RoleProvider');
  var roleProvider;

  describe("constructor", function() {

    it("sets names and implementation", function() {
      var implementation = {myImp: function() {}};
      roleProvider = new RoleProvider("Profile", "Resource", implementation);
      expect(roleProvider.profileName).toBe("Profile");
      expect(roleProvider.resourceName).toBe("Resource");
      expect(roleProvider.implementation).toBe(implementation);
    });
  });

  it("setImplementation", function() {
    roleProvider = new RoleProvider('Event', 'User');
    var implementation = {allRoles: function() {}};
    roleProvider.setImplementation(implementation);
    expect(roleProvider.implementation).toBe(implementation);
  });

  it("getImplementation", function() {
    var implementation = {allRoles: function() {}};
    roleProvider = new RoleProvider('Event', 'User', implementation);
    expect(roleProvider.getImplementation()).toBe(implementation);
  });

  describe("allRoles", function() {
    var profile, resource;

    beforeEach(function() {
      roleProvider = new RoleProvider('Event', 'User');
      profile = {};
      resource = {};
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
        allRoles: function(a, b, cb) {
          cb(null, ['Test']);
        }
      };
      roleProvider.setImplementation(implementation);
      roleProvider.allRoles(profile, resource, function(err, roles) {
        expect(err).toBe(null);
        expect(roles).toEqual(['Test']);
        done();
      });
    });
  });

  describe("bestRole", function() {
    var profile, resource;

    beforeEach(function() {
      roleProvider = new RoleProvider('Event', 'User');
      profile = {};
      resource = {};
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
        bestRole: function(a, b, cb) {
          cb(null, 'Test');
        }
      };
      roleProvider.setImplementation(implementation);
      roleProvider.bestRole(profile, resource, function(err, role) {
        expect(err).toBe(null);
        expect(role).toEqual('Test');
        done();
      });
    });
  });

});
