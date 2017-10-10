'use strict';

/**
 * Require module dependencies.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
  describe('User register', () => {
    it('It should register a new user');
    it('It should get an error trying to register an user with invalid `email` field');
    it('It should get an error trying to register an user with invalid `fullName` field');
    it('It should get an error trying to register an user with invalid `gender` field');
    it('It should get an error trying to register an user with a duplicated email');
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