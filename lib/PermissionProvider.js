"use strict";

var Permission = require('./models/Permission');

/**
 * @constructor
 * @param {String} name [description]
 * @param {Object} implementation       [description]
 */
function PermissionProvider(name, implementation) {
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

  this.getPermission = function(role, resource, cb) {
    if (this.implementation.getPermission !== undefined) {
      this.implementation.getPermission(this, role, resource, cb);
    } else {
      setImmediate(cb, null, new Permission(false, null, this));
    }
  };
}

module.exports = PermissionProvider;
