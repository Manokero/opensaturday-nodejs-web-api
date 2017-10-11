'use strict';

/* global beforeEach, it, describe */

/**
 * Require module dependencies.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('Users', () => {
  let user1;

  beforeEach(async function () {
    user1 = {
      fullName: 'Joan Peralta',
      email: 'joanperalta13@gmail.com',
      gender: 'male'
    };
    user1._id = (await this.db.collection('users').insert(user1)).ops[0];
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
    it('POST /users/register-event    - It should be able to register into an event');
    it('POST /users/register-event    - It should get an error when an event has no coupons available');
    it('POST /users/unregister-event  - It should unregister from an event');
  });
});
