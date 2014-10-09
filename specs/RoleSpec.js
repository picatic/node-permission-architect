"use strict"

describe("Role", function() {
  var Role = require('../lib/Role');

  beforeEach(function() {

  });

  describe("constructor", function() {
    var role = undefined;

    it("name to be set", function() {
      role = new Role("Tester");
      expect(role.name).toBe("Tester");
    });

    it("default weight of 0", function() {
      expect(role.weight).toBe(0);
    })
  });

});
