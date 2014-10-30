"use strict";
var _ = require('underscore');

var Permission = require('./models/Permission');
var Errors = require('./Errors');
/**
 * @constructor
 * @param {String} name [description]
 * @param {Object} implementation       [description]
 */
function PermissionProvider(name, implementation, securityRegistry) {

  // Pre-conditions
  if (_.isString(name) === false) {
    throw new Errors.PermissionArchitectPermissionProviderError('Expected name to be string');
  }
  if (_.isObject(securityRegistry) === false) {
    throw new Errors.PermissionArchitectPermissionProviderError('Expected securityRegistry to be object');
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
   * SecurityRegistry instance
   * @type {SecurityRegistry}
   */
  this._securityRegistry = securityRegistry;

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
   * Set the SecurityRegistry for this Provider
   * @param {SecurityRegistry} securityRegistry [description]
   */
  this.setSecurityRegistry = function(securityRegistry) {
    this._securityRegistry = securityRegistry;
  };

  /**
   * Get the SecurityRegistry for this Provider
   * @return {SecurityRegistry} [description]
   */
  this.getSecurityRegistry = function() {
    return this._securityRegistry;
  };

  /**
   * [getPermission description]
   * @param  {Role}   role     [description]
   * @param  {Resource}   resource [description]
   * @param  {Function} cb       [description]
   */
  this.getPermission = function(role, resource, cb) {
    if (_.isFunction(cb) === false) {
      throw new Errors.PermissionArchitectPermissionProviderError('Expected cb to be function');
    }
    if (_.isObject(role) === false) {
      setImmediate(cb, new Errors.PermissionArchitectPermissionProviderError('Expected role to be object'));
      return;
    }
    if (_.isObject(resource) === false) {
      setImmediate(cb, new Errors.PermissionArchitectPermissionProviderError('Expected resource to be object'));
      return;
    }

    if (this.implementation.getPermission !== undefined) {
      this.implementation.getPermission(this, role, resource, cb);
    } else {
      setImmediate(cb, null, this._securityRegistry.buildPermission(false, null, this));
    }
  };
}

module.exports = PermissionProvider;
