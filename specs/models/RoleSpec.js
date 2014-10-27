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
  });

});
