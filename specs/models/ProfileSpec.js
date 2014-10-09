"use strict"

describe("Profile", function() {
  var Profile = require('../../lib/models/Profile');

  describe("constructor", function() {
    var profile = undefined;

    it("name and identifier set", function() {
      profile = new Profile("Tester", 123);
      expect(profile.name).toBe("Tester");
      expect(profile.identifier).toBe(123);
    });
  });

});
