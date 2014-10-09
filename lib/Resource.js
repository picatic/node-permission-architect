"use strict"

/**
 * Resource
 *
 * Represents something that will be accessed. The most common case
 * is a `Model` within your application.
 *
 * @property {string} [name] The common name, usually the model name
 * @property {mixed} [identifier] whatever unique identifier you use for your models
 * @property {mixed} [context] [user defined, often an instance of the resource in question]
 * @property {object} [config]
 */
function Resource(name, identifier, context, config) {
  this.name = name;
  this.identifier = identifier;
  this.context = context || null;
  this.config = config || {};
  this.behaviour = null;

  /**
   * Set a behaviour on this resource
   * @param {[type]} behaviour [description]
   */
  this.setBehaviour = function(behaviour) {
    this.behaviour = behaviour;
  }

  /**
   * [allow description]
   * @param  {[type]} profile [description]
   * @return {[type]}         [description]
   */
  this.allow = function(profile) {
    roles = profile.getRolesForResource(this);
    return false;
  }

  /**
   * Get the context on this Resource
   * @return {[type]} [description]
   */
  this.getContext = function() {
    return this.context;
  }

  /**
   * Set the context on this resource
   * @param {[type]} context [description]
   */
  this.setContext = function(context) {
    this.context = context;
  }
}

module.exports = Resource;
