'use strict';

/**
 * Require module dependencies
 */
const { ObjectId } = require('mongodb');
const { InvalidId, InvalidEmail, InvalidPersonName, DuplicatedEmail } = require('../errors');

module.exports = userRepository => {
  return {
    async createUser(email, fullName, gender) {
      if (!isValidEmail(email)) {
        throw InvalidEmail();
      }
      if (!isValidName(fullName)) {
        throw InvalidPersonName();
      }
      if (await this.getByEmail(email)) {
        throw DuplicatedEmail();
      }
      return await userRepository.createUser(email, fullName, gender);
    },
    async getById(userId) {
      try {
        userId = ObjectId(userId);
      } catch (err) {
        throw InvalidId(); 
      }
      return await userRepository.byId(userId);
    },
    async getByEmail(email = '') {
      return await userRepository.byEmail(email);
    }
  }
}

function isValidEmail(email) {
  // eslint-disable-line
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function isValidName(name) {
  return /^(\w+)\s+(?:(\w(?=\.)|\w+(?:-\w+)?)\s+)?(\w+(?:-\w+)?)$/.test(name);
}