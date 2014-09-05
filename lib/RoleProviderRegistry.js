"use strict"

RoleProviderRegistry = {
  _roleProviders: [],
  _resource: {},
  _profile: {},
  register: function(roleProvider) {
    this._roleProviders.push(roleProvider);
    this._mapResource(roleProvider);
    this._mapProfile(roleProvider);
  },
  _mapResource: function(roleProvider) {
    if (this._resource[roleProvider.resourceName] === undefined) {
      this._resource[roleProvider.resourceName] = {};
    }
    if (this._resource[roleProvider.resourceName][roleProvider.profileName] === undefined) {
      this._resource[roleProvider.resourceName][roleProvider.profileName] = roleProvider;
    } else {
      //@TODO notify duplicate registered
    }
  },
  _mapProfile: function(profileProvider) {
    if (this._profile[roleProvider.profileName] === undefined) {
      this._profile[roleProvider.profileName] = {};
    }
    if (this._profile[roleProvider.profileName][roleProvider.resourceName] === undefined) {
      this._profile[roleProvider.profileName][roleProvider.resourceName] = roleProvider;
    } else {
      //@TODO notify duplicate registered
    }
  },
  forProfile: function(profileName) {
    return this._profile[profileName];
  },
  forResource: function(resourceName) {
    return this._resource[resourceName];
  },
  lookup: function(profileName, resourceName) {
    if (this._profile[profileName] !== undefined) {
      if (this._profile[profileName][resourceName] !== undefined) {
        return this._profile[profileName][resourceName];
      }
    }
    return false;
  }
};

module.exports = RoleProviderRegistry;
