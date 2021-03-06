'use strict';

/* global beforeEach, afterEach */

/**
 * Set test environment
 */
process.env.NODE_ENV = 'test';

/**
 * Require module dependencies.
 */
const app = require('../../index');
const net = require('net');
const debug = require('debug');
const MongoDbServer = require('mongodb-memory-server').default;

let portrange = 3000;

function getPort () {
  return new Promise((resolve) => {
    const port = portrange;
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => {
        resolve(port);
      })
      server.close();
    });
    server.on('error', () => {
      portrange += 1;
      getPort().then(port => resolve(port));
    });
  });
}

debug('test:app:info')('Setting up test environment ...');

beforeEach(async function () {
  const mongod = new MongoDbServer();
  const httpPort = await getPort();
  const dbUri = await mongod.getConnectionString();
  
  this.mongod = mongod;
  this.db = await app.connectDatabase(dbUri);
  this.services = await app.createServices(this.db);
  this.httpServer = await app.runHttpServer(httpPort, this.services);

  return Promise.resolve();
});

afterEach(function (done) {
  this.mongod.stop();
  app.shutdown().then(() => done()).catch(err => done(err));
});
