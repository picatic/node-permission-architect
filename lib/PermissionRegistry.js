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
   * @return {boolean} true is successful
   */
  this.register = function(resourceName, permissionProviders) {
    var self = this;
    if (_.isString(resourceName) === false) {
      throw new Errors.PermissionArchitectPermissionRegistryError('Expected resourceName to be string');
    }
    if (_.isArray(permissionProviders) === false) {
      throw new Errors.PermissionArchitectPermissionRegistryError('Expected permissionProviders to be an Array');
    }
    if (this.providers[resourceName] === undefined) {
      this.providers[resourceName] = {};
    }

    _.each(permissionProviders, function(permissionProvider) {
      self.providers[resourceName][permissionProvider.name] = permissionProvider;
    });
    this._securityRegistry.log('trace', 'Registered PermissionProvider for Resource %s', resourceName);
    return true;
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

  /**
   * Get the named Permission for a Resource and Role
   * @param  {string}   permissionName [description]
   * @param  {Resource}   resource       [description]
   * @param  {Role}   role           [description]
   * @param  {Function} cb             [description]
   * @return {Permission}                  [description]
   */
  this.getPermission = function(permissionName, resource, role, cb) {
    // Pre-conditions
    if (typeof(cb) !== 'function') {
      throw new Errors.PermissionArchitectPermissionRegistryError('Expected cb to be type of function');
    }
    if (_.isString(permissionName) === false) {
      setImmediate(cb, new Errors.PermissionArchitectPermissionRegistryError('Expected permissionName to be of type String'));
      return;
    }
    if (typeof(resource) !== 'object') {
      setImmediate(cb, new Errors.PermissionArchitectPermissionRegistryError('Expected resource to be type of Object'));
      return;
    }
    if (typeof(role) !== 'object') {
      setImmediate(cb, new Errors.PermissionArchitectPermissionRegistryError('Expected role to be type of Object'));
      return;
    }

    var self = this;
    var providers = self.providersForResource(resource.name);
    if (_.keys(providers).length > 0) {
      if (providers[permissionName] !== undefined) {
        providers[permissionName].getPermission(role, resource, function(err, permission) {
          if (err) {
            cb(err);
          } else {
            self._securityRegistry.log('info', 'Permission %s on %s (%s) as %s => %s', permissionName, resource.name, resource.id, role.name, permission.granted);
            cb(null, permission);
          }
        });
      } else {
        setImmediate(cb, new Errors.PermissionArchitectPermissionProviderNotFound(resource.name, permissionName));
      }
    } else {
      setImmediate(cb, new Errors.PermissionArchitectPermissionProviderResourceNotFound(resource.name));
    }
  };

}

module.exports = PermissionRegistry;
