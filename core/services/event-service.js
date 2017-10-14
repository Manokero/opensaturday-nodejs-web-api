'use strict';

/**
 * Require module dependencies
 */
const { ObjectId } = require('mongodb');
const { InvalidId, EventNotFound, FullEvent } = require('../errors');

module.exports = function(eventRepository) {
  return {
    async insert(title, speaker, tags, totalCoupons, usedCoupons) {
      return await eventRepository.insert(title, speaker, tags, totalCoupons, usedCoupons);
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
    },
    async addUser(eventId, userId) {
      try {
        userId = new ObjectId(userId);
        eventId = new ObjectId(eventId);
      } catch (err) {
        throw InvalidId();
      }
      const event = await this.getById(eventId);
      if (!event) {
        throw EventNotFound();
      }
      const index = event.usersGoing.findIndex(
        id => id.toString() === userId.toString()
      );
      if (index < 0) {
        if (event.usedCoupons >= event.totalCoupons) {
          throw FullEvent();
        }
        event.usersGoing.push(userId);
        await eventRepository.update(eventId, {
          usersGoing: event.usersGoing,
          usedCoupons: ++event.usedCoupons
        });
      }
      return true;
    },
    async removeUser(eventId, userId) {
      try {
        userId = new ObjectId(userId);
        eventId = new ObjectId(eventId);
      } catch (err) {
        throw InvalidId();
      }
      const event = await this.getById(eventId);
      if (!event) {
        throw EventNotFound();
      }
      const index = event.usersGoing.findIndex(
        id => id.toString() === userId.toString()
      );
      if (index > -1) {
        event.usersGoing.splice(index, 1);
        await eventRepository.update(eventId, {
          usersGoing: event.usersGoing,
          usedCoupons: --event.usedCoupons
        });
      }
      return true;
    }
  }
};
