/**
 * Require module dependencies.
 */

const Koa = require('koa');
const koaBody = require('koa-body');

// Include routes

const speakerRoutes = require('./routes/speaker-routes');
const userRoutes = require('./routes/user-routes');

// Include middlewares

const loggerMiddleware = require('./middlewares/logger');
const apiResponseMiddleware = require('./middlewares/apiResponse');

module.exports = services => {
  const app = new Koa();

  app.use(koaBody());
  app.use(loggerMiddleware);
  app.use(apiResponseMiddleware);

  speakerRoutes(app, services);
  userRoutes(app, services);

  return app;
};
