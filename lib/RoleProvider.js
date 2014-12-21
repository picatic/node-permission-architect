"use strict";

var _ = require('underscore');

var Errors = require('./Errors');
/**
 * Provides mapping of roles provided a Profile and Resource instance
 * @param {String} profileName  ProfileName this provider is for
 * @param {String} resourceName ResourceName this provider is for
 * @param {Object} implementation implementation of the RoleProvider interface
 * @param {SessionRegistry} sessionRegistry reference to SessionRegistry
 */
function RoleProvider (profileName, resourceName, implementation, sessionRegistry) {

  // Pre-conditions
  if (_.isString(profileName) === false) {
    throw new Errors.PermissionArchitectRoleProviderError('Expected profileName to be string');
  }
  if (_.isString(resourceName) === false) {
    throw new Errors.PermissionArchitectRoleProviderError('Expected resourceName to be string');
  }

  /**
   * Name of Profile
   * @type {String}
   */
  this.profileName = profileName;
  /**
   * Name of Resource
   * @type {String}
   */
  this.resourceName = resourceName;

  /**
   * Implementation object, optionally provides allRoles and bestRole
   * @type {Object}
   */
  this.implementation = implementation || {};

  /**
   * Security Registry instance
   * @type {SessionRegistry}
   */
  this._sessionRegistry = sessionRegistry || null;

  /**
   * Set the implementation after construction
   * @param {Object} implementation set the implementation
   */
  this.setImplementation = function(implementation) {
    this.implementation = implementation;
  };

  /**
   * Get the implemenation for this RoleProvider
   * @return {Object} get current implemenation
   */
  this.getImplementation = function() {
    return this.implementation;
  };

  /**
   * Set the Security Registry
   * @param {SessionRegistry} sessionRegistry set new SessionRegistry
   */
  this.setSessionRegistry = function(sessionRegistry) {
    this._sessionRegistry = sessionRegistry;
  };

  /**
   * Get the SessionRegistry
   * @return {SessionRegistry} get current SessionRegistry
   */
  this.getSessionRegistry = function() {
    return this._sessionRegistry;
  };

  /**
   * Test preconditions, does not call the callback
   * @param  {Profile}   profile  Profile instance
   * @param  {Resource}   resource Resource instance
   * @param  {Function} cb       callback with cb(err, Array)
   * @returns {Boolean}
   */
  function preconditions(profile, resource, cb) {
    if (_.isFunction(cb) === false) {
      throw new Errors.PermissionArchitectRoleProviderError('Expected cb to be function');
    }
    if (_.isObject(profile) === false) {
      setImmediate(cb, new Errors.PermissionArchitectRoleProviderError('Expected profile to be object'));
      return false;
    }
    if (_.isObject(resource) === false) {
      setImmediate(cb, new Errors.PermissionArchitectRoleProviderError('Expected resource to be object'));
      return false;
    }
    return true;
  }

  /**
   * Provide an array of Role's applicable to this Profile <-> Resource relationship
   *
   * Roles are sorted by highest to lowest weights
   *
   * Returns an empty Array if no applicable roles are found
   *
   * @param  {Profile}   profile  Profile instance
   * @param  {Resource}   resource Resource instance
   * @param  {Function} cb       callback with prototype (err, Array)
   */
  this.allRoles = function(profile, resource, cb) {
    var self = this;
    if (preconditions(profile, resource, cb) === false) {
      return;
    }
    if (self.implementation.allRoles !== undefined) {
      self.implementation.allRoles(self, profile, resource, function(err, roles) {
        if (err) {
          cb(err);
        } else {
          // Check return type
          if (_.isArray(roles) === false) {
            cb(new Errors.PermissionArchitectRoleProviderError('Expected roles returned by implementation.allRoles to be Array'));
            return;
          }
          // Check that items in roles are Role instances
          for(var i = 0; i < roles.length; i++) {
            if (roles[i] instanceof self._sessionRegistry.Models.Role) {
              // pass
            } else {
              err = new Errors.PermissionArchitectRoleProviderError('Expected roles array to contain Role instances');
              break;
            }
          }
          if (err) {
            cb(err);
            return;
          }

          //@TODO sort roles
          cb(null, roles);
        }
      });
    } else {
      setImmediate(cb, null, []);
    }
  };

  /**
   * Returns the single best Role based on weight
   *
   * If no matching role was found, null is provided
   * @param  {Profile}   profile  Profile instance
   * @param  {Resource}   resource Resource instance
   * @param  {Function} cb       callback with prototype (err, Role)
   */
  this.bestRole = function(profile, resource, cb) {
    if (preconditions(profile, resource, cb) === false) {
      return;
    }
    if (this.implementation.bestRole !== undefined) {
      this.implementation.bestRole(this, profile, resource, cb);
    } else {
      this.allRoles(profile, resource, function(err, roles) {
        if (err) {
          cb(err);
        } else if (roles === null || roles.length === 0) {
          cb(null, null);
        } else {
          cb(null, roles[0]);
        }
      });
    }
  };

}

module.exports = RoleProvider;
