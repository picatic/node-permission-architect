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

// util.inherits(Errors.PermissionArchitectPermissionProviderNotFound, Error);
//
Errors.PermissionArchitectPermissionProviderNotFound = function(resourceName, permissionName) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionProviderNotFound';
  this.message = "Could not find PermissionProvider for Resource: " + resourceName + " and permission: " + permissionName;
};

module.exports = Errors;
