'use strict';

/**
 * Require module dependencies.
 */

const koaRouter = require('koa-router');
const { NeedSession } = require('../../core/errors');

module.exports = (app, services) => {
  const router = koaRouter();

  // Create user

  router.post('/users', async (ctx, next) => {
    const { email, fullName, gender } = ctx.request.body;
    ctx.body = await services.users.createUser(email, fullName, gender);
    await next();
  });
  
  // User login
  
  router.post('/users/login', async (ctx, next) => {
    const { email } = ctx.request.body;
    ctx.body = await services.users.login(email);
    await next();
  });
  
  // Get user info by email
  
  router.get('/users/info/:email', async (ctx, next) => {
    const { email } = ctx.params;
    ctx.body = await services.users.getByEmail(email);
    await next();
  });
  
  const checkSession = async (ctx, next) => {
    if (!ctx.headers.authorization) {
      throw NeedSession();
    }
    await next();
  }
  
  // Register to an event.
  
  router.post('/users/register-to-event',
    checkSession,
    async (ctx, next) => {
      const userId = ctx.session.userInfo._id;
      const { eventId } = ctx.request.body;
      ctx.body = await services.events.addUser(eventId, userId);
      await next();
    });
  
  // Unregister from an event.
  
  router.post('/users/unregister-from-event', 
    checkSession,
    async (ctx, next) => {
      const userId = ctx.session.userInfo._id;
      const { eventId } = ctx.request.body; 
      await services.events.removeUser(eventId, userId);
      ctx.body = true;
      await next();
    });

  app.use(router.allowedMethods());
  app.use(router.routes());
};
