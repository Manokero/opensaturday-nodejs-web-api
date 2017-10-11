'use strict';

/**
 * Require module dependencies.
 */

const koaRouter = require('koa-router');

module.exports = (app, services) => {
  const router = koaRouter();

  // Create user

  router.post('/users', async (ctx, next) => {
    const { email, fullName, gender } = ctx.request.body;
    ctx.body = await services.users.createUser(email, fullName, gender);
    await next();
  });

  app.use(router.allowedMethods());
  app.use(router.routes());
};
