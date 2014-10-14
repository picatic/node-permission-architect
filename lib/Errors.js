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
Errors.PermissionArchitectPermissionProviderNotFound = function(resourceName) {
  Error.call(this);
  this.name = 'PermissionArchitectPermissionProviderNotFound';
  this.message = "Permission Provider for Resource " + resourceName + " not found.";
};

util.inherits(Errors.PermissionArchitectPermissionProviderNotFound, Error);

module.exports = Errors;
