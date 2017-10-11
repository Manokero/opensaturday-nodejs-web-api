'use strict';

/**
 * Require module dependencies.
 */

const koaRouter = require('koa-router');

module.exports = (app, services) => {
  const router = koaRouter();

  router.get('/speakers', async (ctx, next) => {
    ctx.body = await services.speakers.getAll();
    await next();
  });
  
  router.get('/speakers/:id', async (ctx, next) => {
    const speakerId = ctx.params.id;
    ctx.body = await services.speakers.getById(speakerId);
    await next();
  });
  
  app.use(router.allowedMethods());
  app.use(router.routes());
};
