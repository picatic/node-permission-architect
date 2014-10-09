"use strict"

var Resource = require('./models/Resource');
var ResourceRegistry = require('./ResourceRegistry');

var Profile = require('./models/Profile');

var RoleProvider = require('./RoleProvider');
var RoleProviderRegistry = require('./RoleProviderRegistry');

/**
 * Singleton Registry and central accessor of all things
 * @param {String} name [description]
 */
function SecurityRegistry(name) {
  /**
   * Name of this instance
   * @type {String}
   */
  this.name = name;

  /**
   * Instance of the RoleProviderRegistry
   * @type {RoleProviderRegistry}
   */
  this._roleProviderRegistry = undefined;

  /**
   * Default role to fallback to
   */
  this._fallbackRole = undefined;

  /**
   * Returns the RoleProviderRegsitry for this SecurityRegistry instance
   *
   * @return {SecurityRegistry}
   */
  this.getRoleProviderRegistry = function() {
    if (this._roleProviderRegistry === undefined) {
      this._roleProviderRegistry = new RoleProviderRegistry(this);
    }
    return this._roleProviderRegistry;
  }

  /**
   * Build a Resource instance for use with various checks
   * @param  {string} name       [description]
   * @param  {mixed} identifier [description]
   * @param  {object} config     [description]
   * @return {Resource}            [description]
   */
  this.buildResource = function(name, identifier, config) {
    var resource = new Resource(name, identifier, config);
    var behaviour = ResourceRegistry.behaviourForResourceName(name);
    if ( behaviour !== false) {
      resource.setBehaviour(behaviour);
    }
    return resource;
  }

  /**
   * Build a Profile instance for use with various checks
   * @param  {string} name       [description]
   * @param  {mixed} identifier [description]
   * @return {Profile}            [description]
   */
  this.buildProfile = function(name, identifier, config) {
    var profile = new Profile(name, identifier, config);
    return profile;
  }

  /**
   * Build a RoleProvider
   * @param  {string} profileName  [description]
   * @param  {string} resourceName [description]
   * @param  {object} config       [description]
   * @return {RoleProvider}              [description]
   */
  this.buildRoleProvider = function(profileName, resourceName, config) {
    var roleProvider = new RoleProvider(profileName, resourceName, config);
    return roleProvider;
  }

  /**
   * Registered the RoleProvider
   * @param  {RoleProvider} roleProvider [description]
   */
  this.registerRoleProvider = function(roleProvider) {
    this.getRoleProviderRegistry().register(roleProvider);
  }

  /**
   * Return RoleProviders avaliable for Profile
   * @param  {string} profileName [description]
   * @return {Array}             [description]
   */
  this.resourcesForProfile = function(profileName) {
    return this.getRoleProviderRegistry().forProfile(profileName);
  }

  /**
   * Return RoleProviders avaliable for the Resource
   * @param  {string} resourceName [description]
   * @return {Array}              [description]
   */
  this.profilesForResource = function(resourceName) {
    return this.getRoleProviderRegistry().forResource(resourceName);
  }


  /**
   * Determines if a Profile and Resource combination can provide the desired role
   * @param  {Profile}   profile     [description]
   * @param  {Resource}   resource    [description]
   * @param  {String/Role}   desiredRole [description]
   * @param  {Function} cb          [description]
   * @return {Boolean}              [description]
   */
  this.hasRole = function(profile, resource, desiredRole, cb) {
    var roleProvider = this.getRoleProviderRegistry().lookup(profile.name, resource.name);
    roleProvider.roleFor(profile, resource, function(err, role) {
      if (err) {
        cb(err);
      } else {
        cb(null, desiredRole === role);
      }
    });
  }

  /**
   * Returns the rule for provided instaces of Profile and Resource
   * Uses the fallback role if no role is determined
   * @param  {Profile}   profile  [description]
   * @param  {Resource}   resource [description]
   * @param  {Function} cb       [description]
   */
  this.roleFor = function(profile, resource, cb) {
    var self = this;
    var roleProvider = this.getRoleProviderRegistry().lookup(profile.name, resource.name);
    if (roleProvider === false) {
      setImmediate(cb, null, this._fallbackRole);
    }
    roleProvider.roleFor(profile, resource, function(err, role) {
      if (err) {
        cb(err);
      } else if (role === undefined) {
        cb(null, self._fallbackRole);
      } else {
        cb(null, role);
      }
    });
  }
}

/**
 * Security instances registered
 * @type {SecurityRegistry}
 */
SecurityRegistry._instances = {};

/**
 * Get an instance by name, create it if it does not exist
 * @param  {string} name [description]
 * @return {SecurityRegistry}      [description]
 */
SecurityRegistry.get = function(name) {
  var name = name || '__default__';
  if (SecurityRegistry._instances[name] === undefined) {
    SecurityRegistry._instances[name] = new SecurityRegistry(name);
  }
  return SecurityRegistry._instances[name];
}

/**
 * Remove a named SecurityRegistry instance
 * @param  {string} name [description]
 * @return {boolean}      true on success, false otherwise
 */
SecurityRegistry.remove = function(name) {
  if (name === undefined) {
    return false;
  }
  if (SecurityRegistry._instances[name] !== undefined) {
    delete(SecurityRegistry._instances[name]);
    return true;
  }
  return false
}

module.exports = SecurityRegistry;
