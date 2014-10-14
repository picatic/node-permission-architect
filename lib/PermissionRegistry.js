"use strict";

var _ = require('underscore');

var Errors = require('./Errors');

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

  /**
   * Return avaliable permissions by resource
   * @param  {[type]} resource [description]
   * @return {[type]}          [description]
   */
  this.permissionsForResource = function(resource) {
    var self = this;
    if (self.providers[resource] !== undefined) {
      return _.keys(self.providers[resource]);
    }
    return [];
  };

  this.providersForResource = function(resource) {
    if (this.providers[resource] !== undefined) {
      return this.providers[resource];
    }
    return {};
  };

  this.getPermission = function(permission, role, resource, cb) {
    var self = this;
    var providers = self.providersForResource(resource.name);
    if (providers[permission] !== undefined) {
      providers[permission].getPermission(role, resource, function(err, permission) {
        if (err) {
          cb(err);
        } else {
          cb(null, permission);
        }
      });
    } else {
      setImmediate(cb, new Errors.PermissionArchitectPermissionProviderNotFound(resource.name));
    }
  };

}

module.exports = PermissionRegistry;
