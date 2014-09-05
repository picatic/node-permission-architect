"use strict"

var ResourceRegistry = require('./ResourceRegistry');
var Resource = require('./Resource');
var ResourceBehaviour = require("./ResourceBehaviour");

var Profile = require('./Profile');

var Role = require('./Role');

var RoleProviderRegistry = require('./RoleProviderRegistry');
var RoleProvider = require('./RoleProvider');

// build our export
var security = {};

security.registerResourceBehaviour = function(name, config) {
  var resourceBehaviour = new ResourceBehaviour(name, config);
  ResourceRegistry.registerResourceBehaviour(name, resourceBehaviour);
}

security.buildResource = function(name, identifier, config) {
  var resource = new Resource(name, identifier, config);
  var behaviour = ResourceRegistry.behaviourForResourceName(name);
  if ( behaviour !== false) {
    resource.setBehaviour(behaviour);
  }
  return resource;
}

security.buildProfile = function(name, identifier) {
  var profile = new Profile(name, identifier);
  return profile;
}

security.buildRoleProvider = function(profileName, resourceName, config) {
  var roleProvider = new RoleProvider(profileName, resourceName, config);
  return roleProvider;
}

security.registerRoleProvider = function(roleProvider) {
  RoleProviderRegistry.register(roleProvider);
}

security.resourcesForProfile = function(profileName) {
  return RoleProviderRegistry.forProfile(profileName);
}

security.profilesForResource = function(resourceName) {
  return RoleProviderRegistry.forResource(resourceName);
}

security.hasRole = function(profile, resource, desiredRole) {
  var roleProvider = RoleProviderRegistry.lookup(profile.name, resource.name);
  var role = roleProvider.roleFor(profile, resource);
  return desiredRole === role;
}

security.roleFor = function(profile, resource) {
  var roleProvider = RoleProviderRegistry.lookup(profile.name, resource.name);
  return roleProvider.roleFor(profile, resource);
}

security.

module.exports = security;
