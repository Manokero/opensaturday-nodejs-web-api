/**
 * Set test environment
 */
process.env.NODE_ENV = 'test';
 
/**
 * Require module dependencies.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('Speakers', () => {
  it('It should get Speakers list', () => {});
  it('It should get a Speaker by id', () => {});
  it('It should get all events of a speaker', () => {});
});