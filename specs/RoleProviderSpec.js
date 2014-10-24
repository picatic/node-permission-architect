"use strict";

describe("RoleProvider", function() {
  var RoleProvider = require('../lib/RoleProvider');
  var roleProvider;

  describe("constructor", function() {

    it("sets names and implementation", function() {
      var implementation = {myImp: function() {}};
      roleProvider = new RoleProvider('Profile', 'Resource', implementation);
      expect(roleProvider.profileName).toBe('Profile');
      expect(roleProvider.resourceName).toBe('Resource');
      expect(roleProvider.implementation).toBe(implementation);
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

  describe("allRoles", function() {
    var profile, resource;

    beforeEach(function() {
      roleProvider = new RoleProvider('User', 'Event');
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
        allRoles: function(provider, profile, resource, cb) {
          cb(null, ['Test']);
        }
      };
      spyOn(implementation, 'allRoles').andCallThrough();
      roleProvider.setImplementation(implementation);
      roleProvider.allRoles(profile, resource, function(err, roles) {
        expect(err).toBe(null);
        expect(roles).toEqual(['Test']);
        expect(implementation.allRoles).toHaveBeenCalledWith(roleProvider, profile, resource, jasmine.any(Function));
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
