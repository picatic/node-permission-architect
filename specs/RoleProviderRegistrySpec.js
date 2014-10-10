"use strict";

var RoleProviderRegistry = require('../lib/RoleProviderRegistry');
var RoleProvider = require('../lib/RoleProvider');

describe('RoleProviderRegistry', function() {
  var roleProviderRegistry, securityRegistry, roleProvider;

  beforeEach(function() {
    securityRegistry = {is: 'securityRegistry'};
    roleProviderRegistry = new RoleProviderRegistry(securityRegistry);
  });

  describe('constructor', function() {

    it('has instance of securityRegistry', function() {
      expect(roleProviderRegistry._securityRegistry).toBe(securityRegistry);
    });

    it('defaults are set', function() {
      expect(roleProviderRegistry._roleProviders).toEqual([]);
      expect(roleProviderRegistry._resource).toEqual({});
      expect(roleProviderRegistry._profile).toEqual({});
    });
  });

  describe('register', function() {

    beforeEach(function() {
      roleProvider = new RoleProvider('User', 'Event');
      roleProviderRegistry.register(roleProvider);
    });

    it('adds to _roleProviders', function() {
      expect(roleProviderRegistry._roleProviders).toEqual([roleProvider]);
    });

    it('maps to _resource', function() {
      expect(roleProviderRegistry._resource).toEqual({Event:{User:roleProvider}});
    });

    it('maps to _profile', function() {
      expect(roleProviderRegistry._profile).toEqual({User:{Event:roleProvider}});
    });
  });

  describe('forProfile', function() {
    var anotherProvider;

    beforeEach(function() {
      roleProvider = new RoleProvider('User', 'Event');
      roleProviderRegistry.register(roleProvider);
      anotherProvider = new RoleProvider('User', 'Ticket');
      roleProviderRegistry.register(anotherProvider);
    });

    it('returns Object of keyed RoleProviders', function() {
      expect(roleProviderRegistry.forProfile('User')).toEqual({Event: roleProvider, Ticket: anotherProvider});
    });
  });

  describe('forResource', function() {
    var anotherProvider;

    beforeEach(function() {
      roleProvider = new RoleProvider('User', 'Event');
      roleProviderRegistry.register(roleProvider);
      anotherProvider = new RoleProvider('Group', 'Event');
      roleProviderRegistry.register(anotherProvider);
    });

    it('returns Object of keyed RoleProviders', function() {
      expect(roleProviderRegistry.forResource('Event')).toEqual({User: roleProvider, Group: anotherProvider});
    });
  });

  describe('lookup', function() {
    var anotherProvider;

    beforeEach(function() {
      roleProvider = new RoleProvider('User', 'Event');
      roleProviderRegistry.register(roleProvider);
    });

    it('returns RoleProviders', function() {
      expect(roleProviderRegistry.lookup('User', 'Event')).toEqual(roleProvider);
    });
  });
});
