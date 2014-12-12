"use strict";
var _ = require('underscore');

var Permission = require('./models/Permission');
var Errors = require('./Errors');
/**
 * @constructor
 * @param {String} name [description]
 * @param {Object} implementation       [description]
 */
function PermissionProvider(name, implementation, sessionRegistry) {

  // Pre-conditions
  if (_.isString(name) === false) {
    throw new Errors.PermissionArchitectPermissionProviderError('Expected name to be string');
  }
  if (_.isObject(sessionRegistry) === false) {
    throw new Errors.PermissionArchitectPermissionProviderError('Expected sessionRegistry to be object');
  }

  /**
   * Permission Name
   * @type {String}
   */
  this.name = name;
  /**
   * Implementation of Permission
   * @type {Object}
   */
  this.implementation = implementation || {};

  /**
   * SessionRegistry instance
   * @type {SessionRegistry}
   */
  this._sessionRegistry = sessionRegistry;

  /**
   * Set the implementation with a new object
   * @param {Object} implementation [description]
   */
  this.setImplementation = function(implementation) {
    this.implementation = implementation;
  };

  /**
   * Get the current implementation
   * @return {Object} [description]
   */
  this.getImplementation = function() {
    return this.implementation;
  };

  /**
   * Set the SessionRegistry for this Provider
   * @param {SessionRegistry} sessionRegistry [description]
   */
  this.setSessionRegistry = function(sessionRegistry) {
    this._sessionRegistry = sessionRegistry;
  };

  /**
   * Get the SessionRegistry for this Provider
   * @return {SessionRegistry} [description]
   */
  this.getSessionRegistry = function() {
    return this._sessionRegistry;
  };

  /**
   * [getPermission description]
   * @param  {Role}   role     [description]
   * @param  {Resource}   resource [description]
   * @param  {Function} cb       [description]
   */
  this.getPermission = function(resource, role, cb) {
    if (_.isFunction(cb) === false) {
      throw new Errors.PermissionArchitectPermissionProviderError('Expected cb to be function');
    }
    if (_.isObject(resource) === false) {
      setImmediate(cb, new Errors.PermissionArchitectPermissionProviderError('Expected resource to be object'));
      return;
    }
    if (_.isObject(role) === false) {
      setImmediate(cb, new Errors.PermissionArchitectPermissionProviderError('Expected role to be object'));
      return;
    }

    if (this.implementation.getPermission !== undefined) {
      this.implementation.getPermission(this, resource, role, cb);
    } else {
      setImmediate(cb, null, this._sessionRegistry.buildPermission(false, null, this));
    }
  };
}

module.exports = PermissionProvider;
