'use strict';

/**
 * Require module dependencies
 */
const { ObjectId } = require('mongodb');
const { InvalidId, 
        InvalidEmail,
        InvalidPersonName,
        DuplicatedEmail,
        InvalidCredentials } = require('../errors');

module.exports = function({ userRepository, sessionService }) {
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
      if (!isValidEmail(email)) {
        throw InvalidEmail();
      }
      return await userRepository.byEmail(email);
    },
    async login(email = '') {
      const user = await this.getByEmail(email);

      if (!user) {
        throw InvalidCredentials();
      }

      const token = await sessionService.createToken(user);
      return token;
    }
  }
}

function isValidEmail(email) {
  // eslint-disable-next-line
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function isValidName(name) {
  // eslint-disable-next-line
  return /^(\w+)\s+(?:(\w(?=\.)|\w+(?:-\w+)?)\s+)?(\w+(?:-\w+)?)$/.test(name);
}
