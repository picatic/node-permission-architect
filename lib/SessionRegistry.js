"use strict";

var NodeCache = require('node-cache');
var _ = require('underscore');

var Models = require('./models');

var RoleProvider = require('./RoleProvider');
var RoleProviderRegistry = require('./RoleProviderRegistry');
var PermissionProvider = require('./PermissionProvider');
var PermissionRegistry = require('./PermissionRegistry');
var Errors = require('./Errors');

/**
 * Singleton Registry and central accessor of all things
 * @param {String} name [description]
 */
function SessionRegistry(name) {
  /**
   * Name of this instance
   * @type {String}
   */
  this.name = name;

  /**
   * Instance of the RoleProviderRegistry
   * @type {RoleProviderRegistry}
   */
  this._roleProviderRegistry = undefined;


  /**
   * Instance of the PermissionRegistry
   * @type {PermissionRegistry}
   */
  this._permissionRegistry = undefined;

  /**
   * Default role to fallback to
   */
  this._fallbackRole = new Models.Role('guest');

  /**
   * Default Permission to fallback to
   */
  this._fallbackPermission = new Models.Permission();

  /**
   * Bunyan compatible logger
   * @type {Object}
   */
  this._logger = null;

  /**
   * Node Cache Logger
   * @type {ObjecT}
   */
  this._cache = null;

  /**
   * Exposed models used within the SessionRegistry
   * @type {Object}
   */
  this.Models = Models;

  /**
   * Expose Errors used within SessionRegistry
   * @type {Object}
   */
  this.Errors = Errors;

  this.setFallbackRole = function(role) {
    this._fallbackRole = role;
  };

  this.getFallbackRole = function() {
    return this._fallbackRole;
  };

  this.setFallbackPermission = function(permission) {
    this._fallbackPermission = permission;
  };

  this.getFallbackPermission = function() {
    return this._fallbackPermission;
  };

  /**
   * Set the logger
   * @param {Object} logger object that implements Bunyan API
   */
  this.setLogger = function(logger) {
    this._logger = logger;
  };

  /**
   * Get the logger
   * @return {Object}
   */
  this.getLogger = function() {
    return this._logger;
  };

  /**
   * Wrap logging calls to our bunyan logger if set, otherwise blackhole
   * @param  {String} level log level
   * @param  {mixed} args
   */
  this.log = function(level) {
    if (this._logger !== null && this._logger[level] !== undefined) {
      var args = Array.prototype.slice.call(arguments).splice(1);
      if (args.length > 0) {
        this._logger[level].apply(this._logger, args);
      }
    }
  };

  this.enableCache = function() {
    this._cache = new NodeCache({stdTTL: 60 * 60, checkperiod: 600});
  };

  /**
   * Returns the RoleProviderRegsitry for this SessionRegistry instance
   *
   * @return {SessionRegistry}
   */
  this.getRoleProviderRegistry = function() {
    if (this._roleProviderRegistry === undefined) {
      this._roleProviderRegistry = new RoleProviderRegistry(this);
    }
    return this._roleProviderRegistry;
  };

  /**
   * Build a Resource instance for use with various checks
   * @param  {string} name       [description]
   * @param  {mixed} identifier [description]
   * @param  {mixed} context     [description]
   * @return {Resource}            [description]
   */
  this.buildResource = function(name, identifier, context) {
    var resource = new Models.Resource(name, identifier, context);
    this.log('trace', 'Built Resource: [%s]:[%s]', name, identifier);
    return resource;
  };

  /**
   * Build a Profile instance for use with various checks
   * @param  {string} name       [description]
   * @param  {mixed} identifier [description]
   * @param  {mixed} context [description]
   * @return {Profile}            [description]
   */
  this.buildProfile = function(name, identifier, context) {
    var profile = new Models.Profile(name, identifier, context);
    this.log('trace', 'Built Profile: [%s]:[%s]', name, identifier);
    return profile;
  };

  this.buildRole = function(name, profile, resource) {
    var role = new Models.Role(name, profile, resource);
    this.log('trace', 'Built Role: [%s]', name);
    return role;
  };

  this.buildPermission = function(granted, context, permissionProvider) {
    var permission = new Models.Permission(granted, context, permissionProvider);
    this.log('trace', 'Built Permission: granted=[%s] (%s)', granted, context);
    return permission;
  };

  /**
   * Build a RoleProvider
   * @param  {string} profileName  [description]
   * @param  {string} resourceName [description]
   * @param  {object} context       [description]
   * @return {RoleProvider}              [description]
   */
  this.buildRoleProvider = function(profileName, resourceName, implementation) {
    var roleProvider = new RoleProvider(profileName, resourceName, implementation, this);
    this.log('trace', 'Built RoleProvider: [%s] => [%s]', profileName, resourceName);
    return roleProvider;
  };

  /**
   * Registered the RoleProvider
   * @param  {RoleProvider} roleProvider [description]
   */
  this.registerRoleProvider = function(roleProvider) {
    this.getRoleProviderRegistry().register(roleProvider);
  };

  /**
   * Return RoleProviders avaliable for Profile
   * @param  {string} profileName [description]
   * @return {Array}             [description]
   */
  this.resourcesForProfile = function(profileName) {
    return this.getRoleProviderRegistry().forProfile(profileName);
  };

  /**
   * Return RoleProviders avaliable for the Resource
   * @param  {string} resourceName [description]
   * @return {Array}              [description]
   */
  this.profilesForResource = function(resourceName) {
    return this.getRoleProviderRegistry().forResource(resourceName);
  };

  /**
   * Builds a PermissionProvider with supplies Role, Resource and context
   * @param  {String} permissionName     [description]
   * @param  {Object} implementation [description]
   */
  this.buildPermissionProvider = function(permissionName, implementation) {
    var permissionProvider = new PermissionProvider(permissionName, implementation, this);
    return permissionProvider;
  };

  this.getPermissionRegistry = function() {
    if (this._permissionRegistry === undefined) {
      this._permissionRegistry = new PermissionRegistry(this);
    }
    return this._permissionRegistry;
  };

  this.registerPermissionProviders = function(resourceName, permissionProviders) {
    var permissionRegistry = this.getPermissionRegistry();
    permissionRegistry.register(resourceName, permissionProviders);
  };

  /**
   * Get the RoleProvider based on a Profile and Resource combination
   * @param {Profile} profile [description]
   * @param {Resource} resource [description]
   */
  this.lookupRoleProvider = function(profile, resource) {
    var roleProvider = this.getRoleProviderRegistry().lookup(profile.name, resource.name);
    if (roleProvider === false) {
      this.log('warn', 'Could not lookup RoleProvider for Profile: ' + profile.name + ' and Resource: ' + resource.name);
    }
    return roleProvider;
  };


  /**
   * Determines if a Profile and Resource combination can provide the desired role
   * @param  {Profile}   profile     [description]
   * @param  {Resource}   resource    [description]
   * @param  {String/Role}   desiredRole [description]
   * @param  {Function} cb          [description]
   * @return {Boolean}              [description]
   */
  this.hasRole = function(profile, resource, desiredRole, cb) {
    var roleProvider = this.lookupRoleProvider(profile, resource);
    roleProvider.roleFor(profile, resource, function(err, role) {
      if (err) {
        cb(err);
      } else {
        cb(null, desiredRole === role);
      }
    });
  };

  /**
   * Returns the role for provided instances of Profile and Resource
   * Uses the fallback role if no role is determined
   * @param  {Profile}   profile  [description]
   * @param  {Resource}   resource [description]
   * @param  {Function} cb       [description]
   */
  this.rolesFor = function(profile, resource, cb) {
    var self = this;
    var roleProvider = this.lookupRoleProvider(profile, resource);
    if (roleProvider === false) {
      this.log('warn', 'Returning fallback Role in absence of RoleProvider');
      setImmediate(cb, null, [this.getFallbackRole()]);
    } else {
      roleProvider.allRoles(profile, resource, function(err, roles) {
        if (err) {
          cb(err);
        } else {
          cb(null, roles);
        }
      });
    }
  };

  /**
   * Returns the best role by weight (or your overriden implementation)
   * @param  {String}   profile  name of profile
   * @param  {String}   resource name of resource
   * @param  {Function} cb       callback(err, Role)
   */
  this.bestRoleFor = function(profile, resource, cb) {
    var self = this;
    var key = "bestRoleFor[" + profile.cacheName() + resource.cacheName() + "]";
    if (self._cache !== null) {
      self._cache.get(key, function(err, val) {
        if (!_.isEmpty(val)) {
          self.log('info', 'Returning cached role');
          cb(null, val[key]);
        } else {
          var roleProvider = self.lookupRoleProvider(profile, resource);
          if (roleProvider === false) {
            self.log('warn', 'Returning fallback Role in absence of RoleProvider');
            setImmediate(cb, null, self.getFallbackRole());
          } else {
            roleProvider.bestRole(profile, resource, function(err, role) {
              if (err) {
                cb(err);
              } else if (role === undefined || role === null) {
                self.log('warn', 'RoleProvider provided (null) result, returning fallback Role');
                cb(null, self.getFallbackRole());
              } else {
                self._cache.set(key, role);
                cb(null, role);
              }
            });
          }
        }
      });
    } else {
      var roleProvider = self.lookupRoleProvider(profile, resource);
      if (roleProvider === false) {
        self.log('warn', 'Returning fallback Role in absence of RoleProvider');
        setImmediate(cb, null, self.getFallbackRole());
      } else {
        roleProvider.bestRole(profile, resource, function(err, role) {
          if (err) {
            cb(err);
          } else if (role === undefined || role === null) {
            self.log('warn', 'RoleProvider provided (null) result, returning fallback Role');
            cb(null, self.getFallbackRole());
          } else {
            cb(null, role);
          }
        });
      }
    }

  };

  this.getPermission = function(permission, resource, role, cb) {
    this.getPermissionRegistry().getPermission(permission, resource, role, cb);
  };

}

/**
 * Session instances registered
 * @type {SessionRegistry}
 */
SessionRegistry._instances = {};

/**
 * Get an instance by name, create it if it does not exist
 * @param  {string} name [description]
 * @return {SessionRegistry}      [description]
 */
SessionRegistry.get = function(name) {
  name = name || '__default__';
  if (SessionRegistry._instances[name] === undefined) {
    SessionRegistry._instances[name] = new SessionRegistry(name);
  }
  return SessionRegistry._instances[name];
};

/**
 * Remove a named SessionRegistry instance
 * @param  {string} name [description]
 * @return {boolean}      true on success, false otherwise
 */
SessionRegistry.remove = function(name) {
  if (name === undefined) {
    return false;
  }
  if (SessionRegistry._instances[name] !== undefined) {
    delete(SessionRegistry._instances[name]);
    return true;
  }
  return false;
};

module.exports = SessionRegistry;
