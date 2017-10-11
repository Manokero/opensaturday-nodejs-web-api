'use strict';

module.exports = db => {
  const collection = db.collection('users');
  return {
    async createUser(email, name, gender) {
      return (await collection.insert({
        email, name, gender
      })).ops[0];
    },
    async byId(userId) {
      return await collection.findOne({
        _id: userId
      });
    },
    async byEmail(email) {
      return await collection.findOne({
        email,
      });
    },
  };
};
