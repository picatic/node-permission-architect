"use strict"

/**
 * @constructor
 * @param {String} name [description]
 * @param {Object} implementation       [description]
 */
function PermissionProvider(name, implementation) {
  /**
   * Resource Name
   * @type {String}
   */
  this.name = name;
  /**
   * Array of PermissionProviders
   * @type {Provider}
   */
  this.implementation = implementation || {};

  this.setImplementation = function(implementation) {
    this.implementation = implementation;
  }
}

module.exports = PermissionProvider;
