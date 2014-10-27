"use strict";

describe("Permission", function() {
  var Permission = require('../../lib/models/Permission');
  var permission;
  describe("constructor", function() {

    it("defaults", function() {
      permission = new Permission();
      expect(permission.granted).toBe(false);
      expect(permission.context).toBe(null);
      expect(permission.provider).toBe(null);
    });

    it('throws exception if granted is not boolean', function() {
      var test = function() {
        new Permission({});
      };

      expect(test).toThrow('Expected granted to be boolean');
    });

  });

});
