'use strict';

module.exports = async (ctx, next) => {
  const token = ctx.headers.authorization;
  
  if (token) {
    const session = ctx.services.sessions.getByToken(token);
    
    if (session) {
      await ctx.services.sessions.checkAndUpdateSession(session.token);
      ctx.session = session;
    } else {
      ctx.session = false;
    }
  }

  await next();
};
