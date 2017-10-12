'use strict';

/* global beforeEach, it, describe */

/**
 * Require module dependencies.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('Speakers', () => {
  let speaker1;

  beforeEach(async function () {
    speaker1 = await this.services.speakers.insert(
      'Joan Peralta',
      'Software Developer for mobile and web applications',
      'InstaCarro', 
      'A crazy software developer', 
      'https://avatars2.githubusercontent.com/u/3039328?v=4&s=460', 
      'jgdev'
    );
    await this.services.speakers.insert(
      'Noe Branagan',
      'Senior Android Developer',
      'InstaCarro',
      'El real nigga',
      '',
      'eonoe'
    );
    return Promise.resolve();
  });
  it('GET /speakers       - It should get Speakers list', function (done) {
    chai.request(this.httpServer)
      .get('/speakers')
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.result.should.be.a('array');
        res.body.result.length.should.be.eql(2);
        done();
      });
  });
  it('GET /speakers/:id   - It should get a Speaker by id', function (done) {
    chai.request(this.httpServer)
      .get(`/speakers/${speaker1._id}`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');

        // Validate speaker properties.
        
        const result = res.body.result;
        result.should.be.a('object');
        result.should.have.deep.property('name', speaker1.name);
        result.should.have.deep.property('company', speaker1.company);
        result.should.have.deep.property('title', speaker1.title);
        result.should.have.deep.property('summary', speaker1.summary);
        result.should.have.deep.property('profileImageUrl', speaker1.profileImageUrl);
        result.should.have.deep.property('githubUsername', speaker1.githubUsername);
        done();
      });
  });
});
