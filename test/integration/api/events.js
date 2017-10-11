'use strict';

/* global it, describe */
 
/**
 * Require module dependencies.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('Events', () => {
  it('It should get all events');
  it('It should get all events that contains same tags by separated commas');
  it('It should get all events by Speaker');
});
