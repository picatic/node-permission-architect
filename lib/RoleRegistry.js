"use strict";

var RoleRegistry = {
  _roles: {},
  register: function(role) {
    this._roles[role.name] = role;
  },
  getRole: function(name) {
    return this._roles[name];
  }
};

module.exports = RoleRegistry;
