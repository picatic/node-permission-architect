"use strict"

/**
 * Profile Class
 *
 * Represents an accessor of resources. Often a `User` or `Group`
 * @property {String} [name] name of the class of Profile.
 * @property {mixed} [id] whatever you use as an identifier.
 * @property {object} [config]
 */
function Profile(name, identifier, config) {
  this.name = name;
  this.identifier = identifier;
  this.config = config || {};
}

module.exports = Profile;
