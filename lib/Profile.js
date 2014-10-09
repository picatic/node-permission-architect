"use strict"

/**
 * Profile Class
 *
 * Represents an accessor of resources. Often a `User` or `Group`
 * @property {String} [name] name of the class of Profile.
 * @property {mixed} [id] whatever you use as an identifier.
 * @property {mixed} [context] user defined data about this Profile. Usually an instance of the User
 * @property {object} [config]
 */
function Profile(name, identifier, context, config) {
  this.name = name;
  this.identifier = identifier;
  this.context = context;
  this.config = config || {};
}

module.exports = Profile;
