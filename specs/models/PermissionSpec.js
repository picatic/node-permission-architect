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
  });

});
