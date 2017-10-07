/**
 * Require module dependencies
 */
 
const config = require('./config');
const api = require('./api');
const { MongoClient } = require('mongodb');
const http = require('http');

let dbConnection, httpServer;

// Create Database connection.

function connectDatabase() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(config.dbSettings.uri, (err, db) => {
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

function runHttpServer(services) {
  return new Promise((resolve, reject) => {
    const appApi = api(services);
    const port = config.httpSettings.port;

    httpServer = http.createServer(appApi.callback());
    httpServer.listen(port, () => {
      resolve();
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

// Booting application

connectDatabase()
  .then(createServices)
  .then(runHttpServer)
  .then(() => {
    console.log('Application Boot ready');
  })
  .catch(err => {
    console.error('Error booting application', err);
  });

// Graceful shutdown.

const shutdown = async () => {
  const date = new Date();
  console.info('\nOh, good bye!, starting graceful shutdown');
  
  if (dbConnection) {
    dbConnection.close();
  }

  if (httpServer) {
    await (new Promise(resolve => {
      httpServer.close(() => resolve());
    }));
  }
  
  console.info(`Graceful shutdown ends [${ Date.now() - date.getTime()}ms]`);
  
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
