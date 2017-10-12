'use strict';

module.exports = db => {
  const collection = db.collection('events');
  return {
    async insert(title, speaker, tags = [], couponsLimit = 0) {
      return (await collection.insert({
        title, speaker, tags, couponsLimit
      })).ops[0];
    },
    async all() {
      return await collection.find({}).toArray();
    },
    async byId(eventId) {
      return await collection.findOne({
        _id: eventId
      });
    }
  }
};