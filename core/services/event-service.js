'use strict';

/**
 * Require module dependencies
 */
const { ObjectId } = require('mongodb');
const { InvalidId, EventNotFound, FullEvent } = require('../errors');

module.exports = function(eventRepository, speakerService) {
  const populateSpeaker = async function(event) {
    const dataSpeaker = await speakerService.getById(event.speaker);
    event.speaker = dataSpeaker;
    return event;
  };
  return {
    async insert(title, speaker, tags, totalCoupons, usedCoupons) {
      return await eventRepository.insert(title, speaker, tags, totalCoupons, usedCoupons);
    },
    async getAll(speaker, { tags = '', speakerInfo }) {
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
      const events = (await eventRepository.all(tags, speaker));
      for (let i = 0; i < events.length; i++) {
        if (typeof speakerInfo !== 'undefined') {
          events[i] = await populateSpeaker(events[i]);
        }
      }
      return events;
    },
    async getById(eventId = '', { speakerInfo } = {}) {
      try {
        eventId = ObjectId(eventId);
      } catch (err) {
        throw InvalidId(); 
      }
      const event = await eventRepository.byId(eventId);
      if (typeof speakerInfo !== 'undefined') {
        return await populateSpeaker(event);
      }
      return event;
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
