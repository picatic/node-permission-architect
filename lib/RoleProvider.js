"use strict"

function RoleProvider (profileName, resourceName, config) {
  this.profileName = profileName;
  this.resourceName = resourceName;
  this.config = config || {};

  this.roleFor = function(profile, resource) {
    return 'guest';
  }
}

module.exports = RoleProvider;
