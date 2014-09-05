"use strict"

/**
 * Resource
 *
 * Represents something that will be accessed. The most common case
 * is a `Model` within your application.
 *
 * @property {string} [name] The common name, usually the model name
 * @property {mixed} [identifier] whatever unique identifier you use for your models
 * @property {object} [config]
 */
function Resource(name, identifier, config) {
  this.name = name;
  this.identifier = identifier;
  this.config = config || {};
  this.behaviour = null;

  this.setBehaviour = function(behaviour) {
    this.behaviour = behaviour;
  }

  this.allow = function(profile) {
    roles = profile.getRolesForResource(this);
    return false;
  }
}

module.exports = Resource;
