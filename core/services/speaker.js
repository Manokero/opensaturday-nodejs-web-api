'use strict';

/**
 * Require module dependencies
 */
const { ObjectId } = require('mongodb');
const { InvalidSpeakerId } = require('../errors');

module.exports = speakerRepository => {
  return {
    async insert(name, company, summary, profileImageUrl, githubUsername) {
      return await speakerRepository.insert(name, company, summary, profileImageUrl, githubUsername);
    },
    async getAll() {
      return await speakerRepository.all();
    },
    async getById(speakerId = '') {
      try {
        speakerId = ObjectId(speakerId);
      } catch (err) {
        throw InvalidSpeakerId(); 
      }
      return await speakerRepository.byId(speakerId);
    }
  }
}