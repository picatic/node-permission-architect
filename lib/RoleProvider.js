"use strict";

/**
 * Provides mapping of roles provided a Profile and Resource instance
 * @param {String} profileName  [description]
 * @param {String} resourceName [description]
 */
function RoleProvider (profileName, resourceName, implementation) {
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
    if (this.implementation.allRoles !== undefined) {
      this.implementation.allRoles(profile, resource, function(err, roles) {
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
    if (this.implementation.bestRole !== undefined) {
      this.implementation.bestRole(profile, resource, cb);
    } else {
      this.allRoles(profile, resource, function(err, roles) {
        if (err) {
          cb(err);
        } else if (roles.length === 0) {
          cb(null, null);
        } else {
          cb(null, roles[0]);
        }
      });
    }
  };
}

module.exports = RoleProvider;
