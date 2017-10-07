/**
 * Require module dependencies.
 */

const Koa = require('koa');
const koaRouter = require('koa-router');

module.exports = services => {
  const app = new Koa();
  const router = koaRouter();
  
  router.get('/hello', async (ctx, next) => {
    ctx.body = 'world';
    await next();
  });
  
  app.use(router.allowedMethods());
  app.use(router.routes());
  
  return app;
}
