"use strict";

describe("Role", function() {
  var Role = require('../../lib/models/Role');

  beforeEach(function() {

  });

  describe("constructor", function() {
    var role;

    it('throws exception if name is not string', function() {
      var test = function() {
        new Role(false);
      };

      expect(test).toThrow('Expected name to be string');
    });

    it("name to be set", function() {
      role = new Role("Tester");
      expect(role.name).toBe("Tester");
    });

    it("default weight of 0", function() {
      expect(role.weight).toBe(0);
    });

    it("default resource to null", function() {
      expect(role.resource).toBe(null);
    });

    it("default profile to null", function() {
      expect(role.profile).toBe(null);
    });

    it("constructor includes profile", function() {
      var profile = {fake: 'profile'};
      role = new Role("Tester", profile);
      expect(role.profile).toBe(profile);
    });

    it("constructor includes resource", function() {
      var resource = {fake: 'resource'};
      role = new Role("Tester", null, resource);
      expect(role.resource).toBe(resource);
    });
  });

});
