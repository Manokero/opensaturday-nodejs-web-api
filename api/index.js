/**
 * Require module dependencies.
 */

const Koa = require('koa');
const koaBody = require('koa-body');

// Include routes

const speakerRoutes = require('./routes/speaker-routes');
const userRoutes = require('./routes/user-routes');
const eventRoutes = require('./routes/event-routes');

// Include middlewares

const loggerMiddleware = require('./middlewares/logger');
const apiResponseMiddleware = require('./middlewares/apiResponse');
const sessionMiddleware = require('./middlewares/session');

module.exports = services => {
  const app = new Koa();

  app.use(async (ctx, next) => {
    ctx.services = services;
    await next();
  });
  app.use(koaBody());
  app.use(loggerMiddleware);
  app.use(apiResponseMiddleware);
  app.use(sessionMiddleware);

  speakerRoutes(app, services);
  userRoutes(app, services);
  eventRoutes(app, services);

  return app;
};
