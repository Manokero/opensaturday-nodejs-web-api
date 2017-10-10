/**
 * Require module dependencies.
 */

const Koa = require('koa');
const koaRouter = require('koa-router');

module.exports = services => {
  const app = new Koa();
  const router = koaRouter();
  
  router.get('/speakers', async (ctx, next) => {
    ctx.body = {
      result: await services.speakers.getAll()
    };
    await next();
  });
  
  router.get('/speakers/:id', async (ctx, next) => {
    const speakerId = ctx.params.id;
    ctx.body = {
      result: await services.speakers.getById(speakerId)
    };
    await next();
  });
  
  app.use(router.allowedMethods());
  app.use(router.routes());
  
  return app;
}
