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

/**
 * A generic error from the PermissionProvider
 * @param {[type]} message [description]
 */
Errors.PermissionArchitectPermissionProviderError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionProviderError';
  this.message = message;
};

/**
 * A generic error from the RoleProvider
 * @param {[type]} message [description]
 */
Errors.PermissionArchitectRoleProviderError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectRoleProviderError';
  this.message = message;
};

/**
 * A generic error from the Permission
 * @param {[type]} message [description]
 */
Errors.PermissionArchitectPermissionError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionError';
  this.message = message;
};

/**
 * A generic error from the Profile
 * @param {[type]} message [description]
 */
Errors.PermissionArchitectProfileError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectProfileError';
  this.message = message;
};

/**
 * A generic error from the Resource
 * @param {[type]} message [description]
 */
Errors.PermissionArchitectResourceError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectResourceError';
  this.message = message;
};

/**
 * A generic error from the Role
 * @param {[type]} message [description]
 */
Errors.PermissionArchitectRoleError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectRoleError';
  this.message = message;
};

module.exports = Errors;
