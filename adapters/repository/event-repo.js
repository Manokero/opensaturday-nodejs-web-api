'use strict';

module.exports = db => {
  const collection = db.collection('events');
  return {
    async insert(title, speaker, tags = [], totalCoupons = 0, usedCoupons = 0) {
      return (await collection.insert({
        title, speaker, tags, totalCoupons, usedCoupons, usersGoing: []
      })).ops[0];
    },
    async all(tags = [], speaker) {
      const query = {};
      if (tags.length) {
        query.tags = {
          $all: tags
        };
      }
      if (speaker) {
        query.speaker = speaker;
      }
      return await collection.find(query).toArray();
    },
    async byId(eventId) {
      return await collection.findOne({
        _id: eventId
      });
    },
    async update(eventId, fields = {}) {
      return (await collection.update({ _id: eventId }, { $set: fields })).result.ok === 1;
    }
  }
};
