var SecurityRegistry = require('../../lib/index');
var sr = SecurityRegistry.get();

// build CRUD
// This is a manual factory pattern and could be paramaterized from a file
sr.registerPermissionProviders('Post', [
  sr.buildPermissionProvider('create', {getPermission: function(provier, role, resource, cb) {
    if (role.name === 'admin') {
      setImmediate(cb, null, sr.buildPermission(true));
    } else {
      setImmediate(cb, null, sr.buildPermission(false));
    }
  }}),
  sr.buildPermissionProvider('update', {getPermission: function(provier, role, resource, cb) {
    if (role.name === 'admin') {
      setImmediate(cb, null, sr.buildPermission(true));
    } else {
      setImmediate(cb, null, sr.buildPermission(false));
    }
  }}),
  sr.buildPermissionProvider('read', {getPermission: function(provier, role, resource, cb) {
    setImmediate(cb, null, sr.buildPermission(true));
  }}),
  sr.buildPermissionProvider('delete', {getPermission: function(provier, role, resource, cb) {
    if (role.name === 'admin') {
      setImmediate(cb, null, sr.buildPermission(true));
    } else {
      setImmediate(cb, null, sr.buildPermission(false));
    }
  }})
]);

// Register RoleProvider

sr.registerRoleProvider(sr.buildRoleProvider('User', 'Post', {allRoles: function(provier, profile, resource, cb) {
  if (profile.identifier == 'thomas') {
    setImmediate(cb, null, [sr.buildRole('admin')]);
  } else {
    setImmediate(cb, null, [sr.buildRole('guest')]);
  }
}}));

// Create some Users to check against
var thomas = sr.buildProfile('User', 'thomas');
var mike = sr.buildProfile('User', 'mike');

// Create some resources
var firstPost = sr.buildResource('Post', 1);
var latestPost = sr.buildResource('Post', 144);

// What role does Mike have?
sr.rolesFor(mike, firstPost, function(err, roles) {
  console.log("Roles for Mike");
  console.log(roles);
});

// How about Thomas?
sr.rolesFor(thomas, firstPost, function(err, roles) {
  console.log("Roles for Thomas");
  console.log(roles);
});

// Can the Role `admin` create posts?
sr.getPermission('create', firstPost, sr.buildRole('admin'), function(err, permission) {
  console.log('Can Role: admin create posts?');
  console.log(permission);
});

// Can the Role `guest` create posts?
sr.getPermission('create', firstPost, sr.buildRole('guest'), function(err, permission) {
  console.log('Can Role: guest create posts?');
  console.log(permission);
});
