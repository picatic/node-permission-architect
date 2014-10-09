"use strict"

/**
 * A role which can be assumed in the system.
 *
 * Often 'guest', 'user', 'admin', 'superadmin', etc
 *
 * @constructor
 * @param {String} name [description]
 */
function Role(name) {
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
}

module.exports = Role;
