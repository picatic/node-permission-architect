"use strict"

/**
 * A role which can be assumed in the system.
 *
 * Often 'guest', 'user', 'admin', 'superadmin', etc
 * @param {string} name [description]
 */
function Role(name) {
  this.name = name;
  this.weight = 0;
}

module.exports = Role;
