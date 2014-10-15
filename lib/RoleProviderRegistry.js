"use strict";

/**
 * Registry for RoleProviders
 * @constructor
 * @param {SecurityRegistry} securityRegistry [description]
 */
function RoleProviderRegistry(securityRegistry) {
  /**
   * [_securityRegistry description]
   * @type {SecurityRegistry}
   */
  this._securityRegistry = securityRegistry;

  /**
   * Array of registered RoleProviders
   * @type {Array}
   */
  this._roleProviders = [];

  /**
   * Map of Resources to RoleProviders
   * @type {Object}
   */
  this._resource = {};

  /**
   * Map of Profiles to RoleProviders
   * @type {Object}
   */
  this._profile = {};

  /**
   * Register a given RoleProvider
   * @param  {RoleProvider} roleProvider [description]
   */
  this.register = function(roleProvider) {
    this._roleProviders.push(roleProvider);
    this._mapTo(this._resource, roleProvider.resourceName, roleProvider.profileName, roleProvider);
    this._mapTo(this._profile, roleProvider.profileName, roleProvider.resourceName, roleProvider);
  };

  /**
   * Build two key deep value map for resource and profile references
   * @private
   * @param  {Object} ref   [description]
   * @param  {String} key_1 [description]
   * @param  {String} key_2 [description]
   * @param  {RoleProvider} value [description]
   */
  this._mapTo = function(ref, key_1, key_2, value) {
    if (ref[key_1] === undefined) {
      ref[key_1] = {};
    }
    if (ref[key_1][key_2] === undefined) {
      ref[key_1][key_2] = value;
    }
  };

  /**
   * Returns the registered RoleProviders for a Profile
   * @param  {String} profileName [description]
   * @return {Object}             [description]
   */
  this.forProfile = function(profileName) {
    return this._profile[profileName];
  };

  /**
   * Returns the registered RoleProviders for a Resource
   * @param  {String} resourceName [description]
   * @return {Object}              [description]
   */
  this.forResource = function(resourceName) {
    return this._resource[resourceName];
  };

  /**
   * Get a RoleProvider for a given named Profile and named Resource
   * @param  {[type]} profileName  [description]
   * @param  {[type]} resourceName [description]
   * @return {[type]}              [description]
   */
  this.lookup = function(profileName, resourceName) {
    if (this._profile[profileName] !== undefined) {
      if (this._profile[profileName][resourceName] !== undefined) {
        return this._profile[profileName][resourceName];
      }
    }
    return false;
  };
}

module.exports = RoleProviderRegistry;
