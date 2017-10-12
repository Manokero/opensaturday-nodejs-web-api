'use strict';

/**
 * Require module dependencies
 */
const { ObjectId } = require('mongodb');
const { InvalidId } = require('../errors');

module.exports = function(eventRepository) {
  return {
    async insert(title, speaker, tags, couponsLimit) {
      return await eventRepository.insert(title, speaker, tags, couponsLimit);
    },
    async getAll({ tags = '' }, speaker) {
      if (tags) {
        tags = tags.split(',');
      }
      
      if (speaker) {
        try {
          speaker = ObjectId(speaker);
        } catch (err) {
          throw InvalidId();
        }
      }
      return await eventRepository.all(tags, speaker);
    },
    async getById(eventId = '') {
      try {
        eventId = ObjectId(eventId);
      } catch (err) {
        throw InvalidId(); 
      }
      return await eventRepository.byId(eventId);
    }
  }
};
