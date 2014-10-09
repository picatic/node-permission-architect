"use strict"

describe("Resource", function() {
  var Resource = require('../lib/Resource');

  describe("constructor", function() {
    var resource = undefined;

    it("name and identifier set", function() {
      resource = new Resource("Tester", 123);
      expect(resource.name).toBe("Tester");
      expect(resource.identifier).toBe(123);
    });
  });

  describe("context", function() {
    var resource = undefined;
    var myContext = undefined;

    function beforeEach() {
      myContext = {
        id: 1,
        title: 'Derp'
      }
      resource = new Resource('Post', 1, myContext);
    };

    it("get", function() {
      expect(resource.getContext()).toBe(myContext);
    });

    it("set", function() {
      newContext = {id: 2, title: 'Herb'};
      resource.setContext(newContext);
      expect(resource.getContext()).toBe(newContext);
    });

  });

});
