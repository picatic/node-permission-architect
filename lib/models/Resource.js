"use strict";

/**
 * Represents something that will be accessed. The most common case
 * is a `Model` within your application.
 *
 * @constructor
 * @property {string} [name] The common name, usually the model name
 * @property {mixed} [identifier] whatever unique identifier you use for your models
 * @property {mixed} [context] [user defined, often an instance of the resource in question]
 */
function Resource(name, identifier, context) {

  /**
   * Name of the resource
   * @type {String}
   */
  this.name = name;

  /**
   * identifier of resource
   * @type {mixed}
   */
  this.identifier = identifier;

  /**
   * Context associated to the resource
   * @type {mixed}
   */
  this.context = context || null;

  /**
   * Get the context on this Resource
   * @return {mixed} [description]
   */
  this.getContext = function() {
    return this.context;
  };

  /**
   * Set the context on this resource
   * @param {mixed} context [description]
   */
  this.setContext = function(context) {
    this.context = context;
  };
}

module.exports = Resource;
