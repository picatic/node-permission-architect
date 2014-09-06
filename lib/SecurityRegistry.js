"use strict"

var Resource = require('./Resource');
var ResourceRegistry = require('./ResourceRegistry');

var Profile = require('./Profile');

var RoleProvider = require('./RoleProvider');
var RoleProviderRegistry = require('./RoleProviderRegistry');

/**
 * Singleton Registry and central accessor of all things
 * @param {[type]} name [description]
 */
function SecurityRegistry(name) {
  this.name = name;
  this._roleProviderRegistry = undefined;

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
  this.buildProfile = function(name, identifier) {
    var profile = new Profile(name, identifier);
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

  this.roleFor = function(profile, resource, cb) {
    var roleProvider = this.getRoleProviderRegistry().lookup(profile.name, resource.name);
    roleProvider.roleFor(profile, resource, cb);
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

module.exports = SecurityRegistry;
