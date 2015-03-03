"use strict";

var _ = require('underscore');

var Errors = require('../Errors');

/**
 * Profile Class
 *
 * Represents an accessor of resources. Often a `User` or `Group`
 *
 * @constructor
 * @property {String} [name] name of the class of Profile.
 * @property {mixed} [id] whatever you use as an identifier.
 * @property {mixed} [context] user defined data about this Profile. Usually an instance of the User.
 */
function Profile(name, identifier, context) {

  // Pre-conditions
  if (_.isString(name) === false) {
    throw new Errors.PermissionArchitectProfileError('Expected name to be string');
  }

  /**
   * Name of the Profile, as a type. E.g. `User` or `Group`
   * @type {String}
   */
  this.name = name;

  /**
   * Identifier of this Profile, usually the primary key
   * @type {mixed}
   */
  this.identifier = identifier;

  /**
   * A context you provide for this Profile. Often an instance of the Profile or information you will use to resolve roles later on.
   * @type {mixed}
   */
  this.context = context;

  /**
   * Get the context on this Resource
   * @return {mixed} context get the context
   */
  this.getContext = function() {
    return this.context;
  };

  /**
   * Set the context on this resource
   * @param {mixed} context set the context
   */
  this.setContext = function(context) {
    this.context = context;
  };

  this.cacheName = function() {
    return "Profile[" + this.name + "][" + this.identifier + "]";
  };
}

module.exports = Profile;
