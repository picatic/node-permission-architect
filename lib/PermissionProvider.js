"use strict"

function PermissionProvider(roleName, resourceName, config) {
  this.roleName = roleName;
  this.resourceName = resourceName;
  this.config = config || {};
}
