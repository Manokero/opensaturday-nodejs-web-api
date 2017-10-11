'use strict';

/**
 * Require module dependencies
 */
const crypto = require('crypto');
const { SessionExpired, InvalidSession } = require('../errors');

const session = [];
const SESSION_EXPIRATION_TIME = 3600; // one hour in seconds.

module.exports = function() {
  return {
      async createToken(userInfo) {
        // Check if user are currently logged.
        const index = session.findIndex((s) => s.userInfo.email === userInfo.email);
        const token = await generateRandomToken();

        if (index > -1) {
            // Delete current token
            session.splice(index, 1);
        }
        
        session.push({
            token,
            userInfo,
            date: Date.now()
        });
        
        return Promise.resolve({
            token
        });
    },
    getByToken (token) {
        const userSession = session.find((s) => s.token === token);
        
        if (!userSession) {
            throw InvalidSession();
        }
    },
    async checkAndUpdateSession(session) {
        const isExpired = (Date.now - session.date) > (SESSION_EXPIRATION_TIME / 1000);
        if (isExpired) {
            throw SessionExpired();
        } else {
            const index = session.findIndex((s) => s.token === session.token);
            if (index > -1) {
                session[index].date = Date.now();
            }
        }
    }
  };
};

function generateRandomToken() {
  return new Promise((resolve) => {
    crypto.randomBytes(16, (err, buffer) => {
      resolve(buffer.toString('hex'));
    });
  });
}
