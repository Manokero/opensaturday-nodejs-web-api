'use strict';

/**
 * Require module dependencies.
 */

const koaRouter = require('koa-router');

module.exports = (app, services) => {
  const router = koaRouter();

  router.get('/events/', async (ctx, next) => {
    ctx.body = await services.events.getAll(null, ctx.query);
    await next();
  });

  router.get('/events/speaker/:id', async (ctx, next) => {
    const { id } = ctx.params;
    ctx.body = await services.events.getAll(id, ctx.query);
    await next();
  });

  router.get('/events/:id', async (ctx, next) => {
    const { id } = ctx.params;
    ctx.body = await services.events.getById(id, ctx.query);
    await next();
  });

  app.use(router.allowedMethods());
  app.use(router.routes());
};
