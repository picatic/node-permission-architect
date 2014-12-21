"use strict";
var _ = require('underscore');

var Permission = require('./models/Permission');
var Errors = require('./Errors');
/**
 * @constructor
 * @param {String} name name of permission
 * @param {Object} implementation       object that implements the permission provider interface
 * @param {SessionRegistry} sessionRegistry reference to the SessionRegistry
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
   * @param {Object} implementation set Implementation
   */
  this.setImplementation = function(implementation) {
    this.implementation = implementation;
  };

  /**
   * Get the current implementation
   * @return {Object} get the current implementation
   */
  this.getImplementation = function() {
    return this.implementation;
  };

  /**
   * Set the SessionRegistry for this Provider
   * @param {SessionRegistry} sessionRegistry set a new SessionRegsitry
   */
  this.setSessionRegistry = function(sessionRegistry) {
    this._sessionRegistry = sessionRegistry;
  };

  /**
   * Get the SessionRegistry for this Provider
   * @return {SessionRegistry} get the current SessionRegistry
   */
  this.getSessionRegistry = function() {
    return this._sessionRegistry;
  };

  /**
   * Given a Resource and Role, what permission do we have
   * @param  {Role}   role     a Role instance
   * @param  {Resource}   resource a Resource instance
   * @param  {Function} cb       callback(err, permissionInstance)
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
