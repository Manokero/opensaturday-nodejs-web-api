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

describe('Events', () => {
  let fakeData;
  beforeEach(async function () {
    // Insert fake data.
    fakeData = (await this.db.collection('events').insert([
      {
        title: 'Making Node.js web api',
        speaker: new ObjectId(),
        tags: ['Node.js', 'JavaScript', 'RESTful', 'OpenSaturday'],
        totalCoupons: 2,
        usedCoupons: 0
      },
      {
        title: 'Swift for iOS in the real world',
        speaker: new ObjectId(),
        tags: ['Swift', 'iOS', 'apple', 'OpenSaturday'],
        totalCoupons: 5,
        usedCoupons: 4
      }
    ])).ops;
    return Promise.resolve();
  });

  it('GET /events                      - It should get all events', function (done) {
    chai.request(this.httpServer)
      .get('/events')
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.result.should.be.a('array');
        res.body.result.length.should.be.eql(2);
        done();
      });
  });
  it('GET /events/:id                  - It should get an event by id', function (done) {
    chai.request(this.httpServer)
      .get(`/events/${fakeData[0]._id}`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        
        const result = res.body.result;
        result.should.be.a('object');
        result.should.have.deep.property('title', fakeData[0].title);
        result.should.have.deep.property('speaker', fakeData[0].speaker.toString());
        
        done();
      });
  });
  it('GET /events/?tags=[tags, ...]    - It should get all events that contains same tags by separated commas', function (done) {
    Promise.all([
      new Promise((resolve, reject) => {
        chai.request(this.httpServer)
          .get(`/events?tags=OpenSaturday`)
          .end((err, res) => {
            if (err) return reject(err);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.result.should.be.a('array');
            res.body.result.length.should.be.eql(2);
            resolve();
          });
      }),
      new Promise((resolve, reject) => {
        chai.request(this.httpServer)
          .get(`/events?tags=Node.js`)
          .end((err, res) => {
            if (err) return reject(err);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.result.should.be.a('array');
            res.body.result.length.should.be.eql(1);
            resolve();
          });
      }),
      new Promise((resolve, reject) => {
        chai.request(this.httpServer)
          .get(`/events?tags=Swift,iOS`)
          .end((err, res) => {
            if (err) return reject(err);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.result.should.be.a('array');
            res.body.result.length.should.be.eql(1);
            resolve();
          });
      })
    ])
    .then(() => done())
    .catch((err) => done(err));
  });
  it('GET /events/?speaker=:speakerId  - It should get all events by Speaker');
});
