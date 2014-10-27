"use strict";

var _ = require('underscore');

var Errors = require('../Errors');

/**
 * Represents a permission
 *
 * @constructor
 * @param {Boolean} granted  [description]
 * @param {mixed} context  [description]
 * @param {PermissionProvider} provider [description]
 */
function Permission(granted, context, provider) {
  /**
   * If this permission is granded
   * @type {Boolean}
   */
  this.granted = granted || false;

  // Pre-conditions
  if (_.isBoolean(this.granted) === false) {
    throw new Errors.PermissionArchitectPermissionError('Expected granted to be boolean');
  }

  /**
   * Context of this permission
   * @type {mixed}
   */
  this.context = context || null;
  /**
   * PermissionProvider that created this Permission
   * @type {PermissionProvider}
   */
  this.provider = provider || null;
}

module.exports = Permission;
