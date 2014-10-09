"use strict"

var _ = require('underscore');

/**
 * Registry for PermissionProviders
 * @param {SecurityRegistry} securityRegistry [description]
 */
function PermissionRegistry(securityRegistry) {
  this._securityRegistry = securityRegistry;
  this.providers = {};

  this.register = function(resourceName, permissionProviders) {
    var self = this;
    if (this.providers[resourceName] === undefined) {
      this.providers[resourceName] = {};
    }

    _.each(permissionProviders, function(permissionProvider) {
      self.providers[resourceName][permissionProvider.name] = permissionProvider;
    });
  }
}

module.exports = PermissionRegistry;
