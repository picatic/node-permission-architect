"use strict"

var ResourceRegistry = {
  _resourceBehaviour: {},
  registerResourceBehaviour: function(name, behaviour) {
    this._resourceBehaviour[name] = behaviour;
  },
  behaviourForResourceName: function(name) {
    console.log(this._resourceBehaviour);
    if (this._resourceBehaviour[name] !== undefined) {
      return this._resourceBehaviour[name];
    }
    return false;
  },
  registerResource: function(resource) {

  }
}

module.exports = ResourceRegistry;
