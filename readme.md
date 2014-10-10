[![Build Status](https://travis-ci.org/picatic/node-permission-architect.png?branch=master)](https://travis-ci.org/picatic/node-permission-architect)
[![NPM version](https://badge.fury.io/js/node-permission-architect.png)](http://badge.fury.io/js/node-permission-architect)
[![Code Climate](https://codeclimate.com/github/picatic/node-permission-architect.png)](https://codeclimate.com/github/picatic/node-permission-architect)

[![NPM](https://nodei.co/npm/node-permission-architect.png?downloads=true)](https://nodei.co/npm/node-permission-architect/)

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
* Use a Bunyan compatible logger


# Model

## Profile

This represents an accessor of resources. In most cases, a User. It could also indicate a
Group, Organization or any other sort accessor you which to check.

## Resource

This represents something to be accessed. Common cases are models: User, Profile, Post, etc.
But could also reflect actual resources: A queue, ports, etc.

## RoleProvider

Every combination of Profile to Resource has to register a RoleProvider. This provider
is tasks with determining what role best fits the provided profile and resource. You can
statically code these, or have it look up the roles from your datasource.

## PermissionProvider

Like the RoleProvider, you will need to provide a RoleProvider for each supported Role and Resource.
This is where you can conditionally provide permissions as defined by your own rules. You could insert
basic CRUD here: ['read', 'write' ] or something more complicated like:

```
{
  read: ['id', 'title', 'author'],
  write: []
}
```

