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

  describe("context", function() {
    var profile = undefined;
    var myContext = undefined;

    beforeEach(function() {
      myContext = {
        id: 1,
        title: 'Derp'
      }
      profile = new Profile('Post', 1, myContext);
    });

    it("get", function() {
      expect(profile.getContext()).toBe(myContext);
    });

    it("set", function() {
      newContext = {id: 2, title: 'Herb'};
      profile.setContext(newContext);
      expect(profile.getContext()).toBe(newContext);
    });

  });

});
