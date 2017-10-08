/**
 * Require module dependencies
 */
 
const config = require('./config');
const api = require('./api');
const { MongoClient } = require('mongodb');
const http = require('http');
const debug = require('debug');

let dbConnection, httpServer;

// Create Database connection.

function connectDatabase(dbUri) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbUri, (err, db) => {
      if (err) {
        reject(err);
      }
      else {
        dbConnection = db;
        resolve(db);
      }
    });
  });
}

function createServices(db) {
  return Promise.resolve({});
}

// Create http server.

function runHttpServer(port, services) {
  return new Promise((resolve, reject) => {
    const appApi = api(services);
    httpServer = http.createServer(appApi.callback());
    httpServer.listen(port, () => {
      debug('app:log')(`Http server listening on port ${port}`);
      resolve(httpServer);
    });
    httpServer.on('error', err => {
      switch (err.code) {
        case 'EADDRINUSE':
          reject(`Tcp port ${port} is already in use.`);
          break;
        case 'EACCES':
          reject(`TCP port ${port} needs elevated permissions.`);
          break;
        default:
          reject(err);
      }
    });
  });
}

// Graceful shutdown.

const shutdown = async () => {
  const date = new Date();
  debug('app:info')('\nOh, good bye!, starting graceful shutdown');

  if (dbConnection) {
    dbConnection.close();
  }

  if (httpServer) {
    await (new Promise(resolve => {
      httpServer.close(() => resolve());
    }));
  }
  
  debug('app:info')(`Graceful shutdown ends [${ Date.now() - date.getTime()}ms]`);
  
  return Promise.resolve();
};

// Booting application

if (process.env.NODE_ENV !== 'test') {
  connectDatabase(config.dbSettings.uri)
  .then(createServices)
  .then(services => runHttpServer(config.httpSettings.port, services))
  .then(() => {
    debug('app:log')('Application Boot ready');
  })
  .catch(err => {
    debug('app:error')('Error booting application', err);
  });
}
else {
  exports.createServices = createServices;
  exports.runHttpServer = runHttpServer;
  exports.connectDatabase = connectDatabase;
  exports.shutdown = shutdown;
}

if (process.env.NODE_ENV !== 'test') {
  process.on('SIGTERM', () => shutdown().then(() => process.exit(0)));
  process.on('SIGINT', () => shutdown().then(() => process.exit(0)));
}