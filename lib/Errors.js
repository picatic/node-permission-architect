var util = require('util');

/**
 * Collection of Errors specific to Permission Architect
 * @type {Object}
 */
Errors = {};

/**
 * When we cannot find a Permission Provider for a Resource
 * @constructor
 */
Errors.PermissionArchitectPermissionProviderResourceNotFound = function(resourceName) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionProviderResourceNotFound';
  this.message = "Could not find PermissionProvider for Resource: " + resourceName;
};

/**
 * When we cannot find a Permission provider for resource and permission
 * @param {[type]} resourceName   [description]
 * @param {[type]} permissionName [description]
 */
Errors.PermissionArchitectPermissionProviderNotFound = function(resourceName, permissionName) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionProviderNotFound';
  this.message = "Could not find PermissionProvider for Resource: " + resourceName + " and permission: " + permissionName;
};

/**
 * A generic error from the PermissionRegistry
 * @param {[type]} message [description]
 */
Errors.PermissionArchitectPermissionRegistryError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionRegistryError';
  this.message = message;
};

module.exports = Errors;
