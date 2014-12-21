"use strict";

/**
 * Collection of Errors specific to Permission Architect
 * @type {Object}
 */
var Errors = {};

/**
 * When we cannot find a Permission Provider for a Resource
 * @param {String} resourceName name of Resource
 */
Errors.PermissionArchitectPermissionProviderResourceNotFound = function(resourceName) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionProviderResourceNotFound';
  this.message = "Could not find PermissionProvider for Resource: " + resourceName;
};

/**
 * When we cannot find a Permission provider for resource and permission
 * @param {String} resourceName   name of Resource
 * @param {String} permissionName name of Permission
 */
Errors.PermissionArchitectPermissionProviderNotFound = function(resourceName, permissionName) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionProviderNotFound';
  this.message = "Could not find PermissionProvider for Resource: " + resourceName + " and permission: " + permissionName;
};

/**
 * A generic error from the PermissionRegistry
 * @param {String} message Error encountered
 */
Errors.PermissionArchitectPermissionRegistryError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionRegistryError';
  this.message = message;
};

/**
 * A generic error from the PermissionProvider
 * @param {String} message Error encountered
 */
Errors.PermissionArchitectPermissionProviderError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionProviderError';
  this.message = message;
};

/**
 * A generic error from the RoleProvider
 * @param {String} message Error encountered
 */
Errors.PermissionArchitectRoleProviderError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectRoleProviderError';
  this.message = message;
};

/**
 * A generic error from the Permission
 * @param {String} message Error encountered
 */
Errors.PermissionArchitectPermissionError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionError';
  this.message = message;
};

/**
 * A generic error from the Profile
 * @param {String} message Error encountered
 */
Errors.PermissionArchitectProfileError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectProfileError';
  this.message = message;
};

/**
 * A generic error from the Resource
 * @param {String} message Error encountered
 */
Errors.PermissionArchitectResourceError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectResourceError';
  this.message = message;
};

/**
 * A generic error from the Role
 * @param {String} message Error encountered
 */
Errors.PermissionArchitectRoleError = function(message) {
  Error.call(this);
  this.name = 'PermissionArchitectRoleError';
  this.message = message;
};

module.exports = Errors;
