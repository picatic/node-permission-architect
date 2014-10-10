"use strict";

var _ = require('underscore');

/**
 * Registry for PermissionProviders
 * @constructor
 * @param {SecurityRegistry} securityRegistry [description]
 */
function PermissionRegistry(securityRegistry) {
  /**
   * Reference to the Security Registry
   * @private
   * @type {SecurityRegistry}
   */
  this._securityRegistry = securityRegistry;
  /**
   * Collection of permissionProviders by Resource name
   * @type {Object}
   */
  this.providers = {};

  /**
   * Register a multiple permissionProviders with a ResourceName
   * @param  {String} resourceName        [description]
   * @param  {Array[PermissionProvider]} permissionProviders [description]
   */
  this.register = function(resourceName, permissionProviders) {
    var self = this;
    if (this.providers[resourceName] === undefined) {
      this.providers[resourceName] = {};
    }

    _.each(permissionProviders, function(permissionProvider) {
      self.providers[resourceName][permissionProvider.name] = permissionProvider;
    });
  };
}

module.exports = PermissionRegistry;
