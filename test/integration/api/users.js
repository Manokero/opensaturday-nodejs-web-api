'use strict';

/* global beforeEach, it, describe */

/**
 * Require module dependencies.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const { ObjectId } = require('mongodb');

chai.should();
chai.use(chaiHttp);

describe('Users', () => {
  let user1, fakeEvents; // eslint-disable-line

  beforeEach(async function () {
    // Insert fake users
    user1 = {
      fullName: 'Joan Peralta',
      email: 'joanperalta13@gmail.com',
      gender: 'male'
    };
    user1._id = (await this.db.collection('users').insert(user1)).ops[0];
    
    // Insert fake events
    fakeEvents = (await this.db.collection('events').insert([
      {
        title: 'Making Node.js web api',
        speaker: new ObjectId(),
        tags: ['Node.js', 'JavaScript', 'RESTful', 'OpenSaturday'],
        totalCoupons: 2,
        usedCoupons: 2,
        usersGoing: []
      },
      {
        title: 'Swift for iOS in the real world',
        speaker: new ObjectId(),
        tags: ['Swift', 'iOS', 'apple', 'OpenSaturday'],
        totalCoupons: 5,
        usedCoupons: 4,
        usersGoing: []
      }
    ])).ops;
  });

  describe('User register', () => {
    it('POST /users                   - It should get an error trying to register an user with invalid `fullName` field', function (done) {
      chai.request(this.httpServer)
        .post('/users')
        .send({
          fullName: '',
          email: 'john@doe.test',
          gender: 'male'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.code.should.equal('E_INVALID_PERSON_NAME');
          done();
        });
    });
    it('POST /users                   - It should get an error trying to register an user with invalid `email` field', function (done) {
      chai.request(this.httpServer)
        .post('/users')
        .send({
          fullName: 'John Doe',
          email: '',
          gender: 'male'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.code.should.equal('E_INVALID_EMAIL');
          done();
        });
    });
    it('POST /users                   - It should get an error trying to register an user with a duplicated email', function (done) {
      chai.request(this.httpServer)
        .post('/users')
        .send({
          fullName: 'John Doe',
          email: 'joanperalta13@gmail.com',
          gender: 'male'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.code.should.equal('E_DUPLICATED_EMAIL');
          done();
        });
    });
    it('POST /users                   - It should register a new user', function (done) {
      chai.request(this.httpServer)
        .post('/users')
        .send({
          fullName: 'John Doe',
          email: 'john@doe.test',
          gender: 'male'
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.result.should.be.a('object');
          res.body.result.should.have.deep.property('_id');

          done();
        });
    });
  });
  describe('User login', () => {
    it('POST /users/login             - It should get an error login with invalid `email`', function (done) {
      chai.request(this.httpServer)
        .post('/users/login')
        .send({
          email: ''
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.code.should.equal('E_INVALID_EMAIL');
          done();
        });
    });
    it('POST /users/login             - It should get an error login with invalid credentials', function (done) {
      chai.request(this.httpServer)
        .post('/users/login')
        .send({
          email: 'test@email.com'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.code.should.equal('E_INVALID_CREDENTIALS');
          done();
        });
    });
    it('POST /users/login             - It should login with a correct email and return session token', function (done) {
      chai.request(this.httpServer)
        .post('/users/login')
        .send({
          email: 'joanperalta13@gmail.com'
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.result.should.be.a('object');
          res.body.result.should.have.deep.property('token');
          
          done();
        });
    });
  });

  describe('User events', () => {
    it('POST /users/register-to-event       - It should get an error with wrong authentication', function (done) {
      chai.request(this.httpServer)
        .post('/users/register-to-event')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.code.should.equal('E_NEED_AUTHENTICATION');
          
          done();
        });
    });
    it('POST /users/register-to-event       - It should be able to register into an event', async function () {
      const token = (await this.services.users.login(user1.email)).token;
      const user = this.services.sessions.getByToken(token).userInfo;
      await (new Promise((resolve, reject) => {
        chai.request(this.httpServer)
          .post('/users/register-to-event')
          .send({
            eventId: fakeEvents[1]._id
          })
          .set('Authorization', token)
          .end(async (err, res) => {
            try {
              if (err) {
                return reject(err);
              }
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.result.should.be.a('boolean');
              res.body.result.should.equal(true);
    
              // Check in db if user are registered.
              
              const event = (await this.services.events.getById(fakeEvents[1]._id));
              
              event.usersGoing.should.deep.include(user._id);
              event.usedCoupons.should.equal(fakeEvents[1].usedCoupons + 1);
              
              resolve();
            } catch (err) {
              reject(err);
            }
          });
      }));
    });
    it('POST /users/register-to-event       - It should get an error when an event has no coupons available', async function () {
      const token = (await this.services.users.login(user1.email)).token;
      await (new Promise((resolve, reject) => {
        chai.request(this.httpServer)
          .post('/users/register-to-event')
          .send({
            eventId: fakeEvents[0]._id
          })
          .set('Authorization', token)
          .end(async (err, res) => {
            try {
              res.should.have.status(423);
              res.body.should.be.a('object');
              res.body.code.should.equal('E_RESOURCE_LOCKED');
              resolve();
            } catch (err) {
              reject(err);
            }
          });
      }));
    });
    it('POST /users/unregister-from-event   - It should get an error with wrong authentication', function (done) {
      chai.request(this.httpServer)
        .post('/users/unregister-from-event')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.code.should.equal('E_NEED_AUTHENTICATION');
          
          done();
        });
    });
    it('POST /users/unregister-from-event   - It should unregister from an event', async function () {
      const token = (await this.services.users.login(user1.email)).token;
      const user = this.services.sessions.getByToken(token).userInfo;
      await (new Promise((resolve, reject) => {
        chai.request(this.httpServer)
          .post('/users/register-to-event')
          .send({
            eventId: fakeEvents[1]._id
          })
          .set('Authorization', token)
          .end(async (err, res) => {
            try {
              if (err) {
                return reject(err);
              }
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.result.should.be.a('boolean');
              res.body.result.should.equal(true);
    
              // Check in db if user are registered.
              
              const event = (await this.services.events.getById(fakeEvents[1]._id));
              
              event.usersGoing.should.deep.include(user._id);
              event.usedCoupons.should.equal(fakeEvents[1].usedCoupons + 1);
              
              resolve();
            } catch (err) {
              reject(err);
            }
          });
      }));
      await (new Promise((resolve, reject) => {
        chai.request(this.httpServer)
          .post('/users/unregister-from-event')
          .send({
            eventId: fakeEvents[1]._id
          })
          .set('Authorization', token)
          .end(async (err, res) => {
            try {
              if (err) {
                return reject(err);
              }
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.result.should.be.a('boolean');
              res.body.result.should.equal(true);
    
              // Check in db if user are registered.
              
              const event = (await this.services.events.getById(fakeEvents[1]._id));
              event.usersGoing.should.deep.not.include(user._id);
              event.usedCoupons.should.equal(fakeEvents[1].usedCoupons);

              resolve();
            } catch (err) {
              reject(err);
            }
          });
      }));
    });
  });
});
