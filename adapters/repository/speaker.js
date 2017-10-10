'use strict';

module.exports = db => {
  const collection = db.collection('speakers');
  return {
    async insert(name, title, company, summary, profileImageUrl, githubUsername) {
      return (await collection.insert({
        name, title, company, summary, profileImageUrl, githubUsername
      })).ops[0];
    },
    async all() {
      return await collection.find({}).toArray();
    },
    async byId(speakerId) {
      return await collection.findOne({
        _id: speakerId
      });
    }
  }
}