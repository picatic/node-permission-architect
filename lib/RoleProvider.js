"use strict";

var _ = require('underscore');

var Errors = require('./Errors');
/**
 * Provides mapping of roles provided a Profile and Resource instance
 * @param {String} profileName  [description]
 * @param {String} resourceName [description]
 */
function RoleProvider (profileName, resourceName, implementation) {

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
   * Test preconditions
   * @param  {Profile}   profile  [description]
   * @param  {Resource}   resource [description]
   * @param  {Function} cb       callback with prototype (err, Array)
   */
  function preconditions(profile, resource, cb) {
    if (_.isObject(profile) === false) {
      throw new Errors.PermissionArchitectRoleProviderError('Expected profile to be object');
    }
    if (_.isObject(resource) === false) {
      throw new Errors.PermissionArchitectRoleProviderError('Expected resource to be object');
    }
    if (_.isFunction(cb) === false) {
      throw new Errors.PermissionArchitectRoleProviderError('Expected cb to be function');
    }
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
    preconditions(profile, resource, cb);
    if (this.implementation.allRoles !== undefined) {
      this.implementation.allRoles(this, profile, resource, function(err, roles) {
        if (err) {
          cb(err);
        } else {
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
    preconditions(profile, resource, cb);
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
