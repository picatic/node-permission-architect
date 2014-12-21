"use strict";

var _ = require('underscore');

var Errors = require('../Errors');

/**
 * A role which can be assumed in the system.
 *
 * Often 'guest', 'user', 'admin', 'superadmin', etc
 *
 * @constructor
 * @param {String} name
 * @param {Profile} profile instance of Profile that created this Role
 * @param {Resource} resource instance of Resource that created this Role
 */
function Role(name, profile, resource) {

  // Pre-conditions
  if (_.isString(name) === false) {
    throw new Errors.PermissionArchitectRoleError('Expected name to be string');
  }

  /**
   * Name of the role, for your reference
   * @type {String}
   */
  this.name = name;

  /**
   * Roles with greater weights will have preference in selecting permissions
   * @type {Number}
   */
  this.weight = 0;

  /**
   * Resource used to define role
   * @type {Resource}
   */
  this.resource = resource || null;

  /**
   * Profile used to define role
   * @type {Profile}
   */
  this.profile = profile || null;

}

module.exports = Role;
