'use strict';

/**
 * Require module dependencies.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
  let user1, user2;

  beforeEach(async function () {
    user1 = {
      fullName: 'Joan Peralta',
      email: 'joanperalta13@gmail.com',
      gender: 'male'
    };
    user1._id = (await this.db.collection('users').insert(user1)).ops[0];
  });

  describe('User register', () => {
    it('POST /users - It should get an error trying to register an user with invalid `fullName` field', function (done) {
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
    it('POST /users - It should get an error trying to register an user with invalid `email` field', function (done) {
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
    it('POST /users - It should get an error trying to register an user with a duplicated email', function (done) {
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
    it('POST /users - It should register a new user', function (done) {
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
    it('It should login with a correct email');
    it('It should get an error login with invalid email');
  });
  describe('User events', () => {
    it('It should register to an event');
    it('It should unregister from an event');
    it('It should get an error when an event has no coupons available');
  });
});