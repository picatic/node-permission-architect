"use strict"

function RoleProviderRegistry(securityRegistry) {
  this._securityRegistry = securityRegistry;
  this._roleProviders = [];
  this._resource = {};
  this._profile = {};

  this.register = function(roleProvider) {
    this._roleProviders.push(roleProvider);
    this._mapResource(roleProvider);
    this._mapProfile(roleProvider);
  }

  this._mapResource = function(roleProvider) {
    if (this._resource[roleProvider.resourceName] === undefined) {
      this._resource[roleProvider.resourceName] = {};
    }
    if (this._resource[roleProvider.resourceName][roleProvider.profileName] === undefined) {
      this._resource[roleProvider.resourceName][roleProvider.profileName] = roleProvider;
    } else {
      //@TODO notify duplicate registered
    }
  }

  this._mapProfile = function(profileProvider) {
    if (this._profile[roleProvider.profileName] === undefined) {
      this._profile[roleProvider.profileName] = {};
    }
    if (this._profile[roleProvider.profileName][roleProvider.resourceName] === undefined) {
      this._profile[roleProvider.profileName][roleProvider.resourceName] = roleProvider;
    } else {
      //@TODO notify duplicate registered
    }
  }

  this.forProfile = function(profileName) {
    return this._profile[profileName];
  }

  this.forResource = function(resourceName) {
    return this._resource[resourceName];
  }

  this.lookup = function(profileName, resourceName) {
    if (this._profile[profileName] !== undefined) {
      if (this._profile[profileName][resourceName] !== undefined) {
        return this._profile[profileName][resourceName];
      }
    }
    return false;
  }
};

module.exports = RoleProviderRegistry;
