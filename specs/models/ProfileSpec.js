"use strict";

describe("Profile", function() {
  var Profile = require('../../lib/models/Profile');

  describe("constructor", function() {
    var profile;

    it('throws exception if name is not string', function() {
      var test = function() {
        new Profile(false);
      };

      expect(test).toThrow('Expected name to be string');
    });

    it("name and identifier set", function() {
      profile = new Profile("Tester", 123);
      expect(profile.name).toBe("Tester");
      expect(profile.identifier).toBe(123);
    });
  });

  describe("context", function() {
    var profile, myContext;

    beforeEach(function() {
      myContext = {
        id: 1,
        title: 'Derp'
      };
      profile = new Profile('Post', 1, myContext);
    });

    it("get", function() {
      expect(profile.getContext()).toBe(myContext);
    });

    it("set", function() {
      var newContext = {id: 2, title: 'Herb'};
      profile.setContext(newContext);
      expect(profile.getContext()).toBe(newContext);
    });

  });

});
