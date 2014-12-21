[![Build Status](https://travis-ci.org/picatic/node-permission-architect.png?branch=master)](https://travis-ci.org/picatic/node-permission-architect)
[![NPM version](https://badge.fury.io/js/permission-architect.png)](http://badge.fury.io/js/permission-architect)
[![Code Climate](https://codeclimate.com/github/picatic/node-permission-architect.png)](https://codeclimate.com/github/picatic/node-permission-architect)

[![NPM](https://nodei.co/npm/permission-architect.png?downloads=true)](https://nodei.co/npm/permission-architect/)

# Why another ACL manager?

Something that has bothered me about some ACL managers is how restricted they are.
I often come across cases where dynamically determining the role based on more than ACL
records is required. I also wanted to reflect different permissions based on the resources
life cycle. I also wanted something that was not coupled to any sort of datasource. Sometimes
you can do things statically, other times you can query a datasource to get what you need to know.

I wanted to provide a layer that clearly defined what handled determining the role and permissions
of each part of the system.

# Features

* You provide the data layer
* Built for async work-flows
* Supports multiple instances, so you can provide different ACL mappings within the same process.
* You can pass your own context/state to use within each Provider
* Easy to migrate too from your existing ACL system (probably, let us know!)
* Bunyan compatible logger

# Some implementation details

* If a method takes multiple models, they will always be in this order: Profile, Resource, Role, Permission.
* `null` is considered intentionally not defined.


# Model

## SessionRegistry

An globally registred instance with an optional name.

```
var sessionRegistry.get();

// Or

var sessionRegstry.get('myInstance');
```

## Profile

This represents an accessor of resources. In most cases, a User. It could also indicate a
Group, Organization or any other sort accessor you which to check.

```
var profile = sessionRegistry.buildProfile('User', 1000, userModel);
```

## Resource

This represents something to be accessed. Common cases are models: User, Profile, Post, etc.
But could also reflect actual resources: A queue, ports, etc.

```
var resource = sessionRegistry.buildResource('Post', 2000, postModel);
```

## RoleProvider

Every combination of Profile to Resource has to register a RoleProvider. This provider
is tasks with determining what role best fits the provided profile and resource. You can
statically code these, or have it look up the roles from your datasource.

```
var roleProvider = sessionRegistry.buildRoleProvider('User', 'Post', {
  getRoles: function(roleProvider, profile, resource, callback) {
    var role = this.sessionProvider.buildRole('owner', profile, resource);
    callback(null, [roll]);
  }
});
```

## RoleProviderRegistry

After creating a RoleProvider you need to register it so future lookups can be completed.

```
sessionRegistry.registerRoleProvider(roleProvider);
```

## PermissionProvider

PermissionProviders provided for each permission on a named Resource.

```
var create = sessionRegistry.buildPermissionProvider('create', {
  getPermission: function(permissionProvider, resource, role, cb) {
    return permissionProvider.getSessionRegistry().buildPermission(true, {}, permissionProvider);
  }
}
);
```

## PermissionRegistry

A collection of PermissionProviders for a named Resource must be registered for future lookups.

```
sessionRegistry.registerPermissionProvider('Post', [create]);
```

## Permission

Represents a permission derived from a PermissionProvided with a provided Resource.

```
sessionRegistry.buildPermisison(
  true, //granted or not
  {limit: 10}, //additional contextual information you can provided
  permissionProvider // reference to the permissionProvider that made this Permission
);
```

# Usage

## rolesFor

Find all the applicable Roles for the provided Profile and Resource.

```
sessionRegistry.rolesFor(profile, resource, function(err, roles) {
  // roles is an array of Role
});

## bestRoleFor

Find a single Role that is the best by weight.

```
sessionRegistry.bestRoleFor(profile, resource, function(err, role) {
  // role is a single Role
});

## getPermission

Fetch a Permission for a Resource being accessed with the provided Role.

```
sessionRegistry.getPermission('create', resource, role, function(err, permission) {
  if (permission.granted === false) {
    throw new Error('Permission denied');
  } else {
    // granted!
  }
}
});
```




