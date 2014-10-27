"use strict";
var _ = require('underscore');

var Permission = require('./models/Permission');
var Errors = require('./Errors');
/**
 * @constructor
 * @param {String} name [description]
 * @param {Object} implementation       [description]
 */
function PermissionProvider(name, implementation) {

  // Pre-conditions
  if (_.isString(name) === false) {
    throw new Errors.PermissionArchitectPermissionProviderError('Expected name to be string');
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

  this.setImplementation = function(implementation) {
    this.implementation = implementation;
  };

  this.getImplementation = function() {
    return this.implementation;
  };

  /**
   * [getPermission description]
   * @param  {Role}   role     [description]
   * @param  {Resource}   resource [description]
   * @param  {Function} cb       [description]
   */
  this.getPermission = function(role, resource, cb) {
    if (_.isObject(role) === false) {
      throw new Errors.PermissionArchitectPermissionProviderError('Expected role to be object');
    }
    if (_.isObject(resource) === false) {
      throw new Errors.PermissionArchitectPermissionProviderError('Expected resource to be object');
    }
    if (_.isFunction(cb) === false) {
      throw new Errors.PermissionArchitectPermissionProviderError('Expected cb to be function');
    }
    if (this.implementation.getPermission !== undefined) {
      this.implementation.getPermission(this, role, resource, cb);
    } else {
      setImmediate(cb, null, new Permission(false, null, this));
    }
  };
}

module.exports = PermissionProvider;
