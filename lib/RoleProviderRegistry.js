"use strict";

/**
 * Registry for RoleProviders
 * @constructor
 * @param {SessionRegistry} sessionRegistry Reference to SessionRegistry
 */
function RoleProviderRegistry(sessionRegistry) {
  /**
   * Reference to SessionRegistry
   * @type {SessionRegistry}
   */
  this._sessionRegistry = sessionRegistry;

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
   * @param  {RoleProvider} roleProvider RoleProvider instance
   */
  this.register = function(roleProvider) {
    this._roleProviders.push(roleProvider);
    this._mapTo(this._resource, roleProvider.resourceName, roleProvider.profileName, roleProvider);
    this._mapTo(this._profile, roleProvider.profileName, roleProvider.resourceName, roleProvider);
    this._sessionRegistry.log('trace', 'Registered RoleProvider [%s] => [%s]', roleProvider.profileName, roleProvider.resourceName);
  };

  /**
   * Build two key deep value map for resource and profile references
   * @private
   * @param  {Object} ref   Object to map onto
   * @param  {String} key_1 first level key
   * @param  {String} key_2 second level key
   * @param  {RoleProvider} value Map these keys to this
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
   * @param  {String} profileName profile name
   * @return {Object}             Map of RoleProviders by ProfileName
   */
  this.forProfile = function(profileName) {
    return this._profile[profileName];
  };

  /**
   * Returns the registered RoleProviders for a Resource
   * @param  {String} resourceName [description]
   * @return {Object}              Map of RoleProviders by ResourceName
   */
  this.forResource = function(resourceName) {
    return this._resource[resourceName];
  };

  /**
   * Get a RoleProvider for a given named Profile and named Resource
   * @param  {String} profileName  Profile name
   * @param  {String} resourceName Resource name
   * @return {RoleProvider/bool}              matching role provider or false
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
