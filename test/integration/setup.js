'use strict';

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
  return new Promise((resolve, reject) => {
    var port = portrange;
  
    var server = net.createServer();
    server.listen(port, function (err) {
      server.once('close', function () {
        resolve(port);
      })
      server.close();
    });
    server.on('error', function (err) {
      portrange += 1;
      getPort().then(port => resolve(port));
    });
  });
}

debug('test:app:info')('Setting up test environment ...');

beforeEach(async function () {
  const httpPort = await getPort();
  const mongod = new MongoDbServer();
  const dbUri = await mongod.getConnectionString();
  
  this.dbConnection = await app.connectDatabase(dbUri);
  this.services = await app.createServices(this.dbConnection);
  this.httpServer = await app.runHttpServer(httpPort, this.services);

  return Promise.resolve();
});

afterEach(done => {
  app.shutdown().then(() => done()).catch(err => done(err));;
});

after(done => {
  process.exit(0);
});
