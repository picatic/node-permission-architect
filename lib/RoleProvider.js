"use strict";

var _ = require('underscore');

var Errors = require('./Errors');
/**
 * Provides mapping of roles provided a Profile and Resource instance
 * @param {String} profileName  [description]
 * @param {String} resourceName [description]
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
   * @param {Object} implementation [description]
   */
  this.setImplementation = function(implementation) {
    this.implementation = implementation;
  };

  /**
   * Get the implemenation for this RoleProvider
   * @return {Object} [description]
   */
  this.getImplementation = function() {
    return this.implementation;
  };

  /**
   * Set the Security Registry
   * @param {SessionRegistry} sessionRegistry [description]
   */
  this.setSessionRegistry = function(sessionRegistry) {
    this._sessionRegistry = sessionRegistry;
  };

  /**
   * Get the SessionRegistry
   * @return {SessionRegistry} [description]
   */
  this.getSessionRegistry = function() {
    return this._sessionRegistry;
  };

  /**
   * Test preconditions
   * @param  {Profile}   profile  [description]
   * @param  {Resource}   resource [description]
   * @param  {Function} cb       callback with prototype (err, Array)
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
   * @param  {Profile}   profile  [description]
   * @param  {Resource}   resource [description]
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
   * @param  {Profile}   profile  [description]
   * @param  {Resource}   resource [description]
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
