"use strict";

var Resource = require('../../lib/models/Resource');

describe("Resource", function() {

  describe("constructor", function() {
    var resource;

    it('throws exception if name is not string', function() {
      var test = function() {
        new Resource(false);
      };

      expect(test).toThrow('Expected name to be string');
    });

    it("name and identifier set", function() {
      resource = new Resource("Tester", 123);
      expect(resource.name).toBe("Tester");
      expect(resource.identifier).toBe(123);
    });
  });

  describe("context", function() {
    var resource, myContext;

    beforeEach(function() {
      myContext = {
        id: 1,
        title: 'Derp'
      };
      resource = new Resource('Post', 1, myContext);
    });

    it("get", function() {
      expect(resource.getContext()).toBe(myContext);
    });

    it("set", function() {
      var newContext = {id: 2, title: 'Herb'};
      resource.setContext(newContext);
      expect(resource.getContext()).toBe(newContext);
    });

  });


  describe("cacheName", function() {
    var resource;

    beforeEach(function() {
      resource = new Resource('Post', 1);
    });

    it("has cacheName", function() {
      expect(resource.cacheName()).toBe("Resource[Post][1]");
    });

  });
});
