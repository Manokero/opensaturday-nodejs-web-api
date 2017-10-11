'use strict';

/**
 * Require module dependencies.
 */

const debug = require('debug');
const utils = require('../utils');

/**
 * Export Api Response middleware.
 */

module.exports = async (ctx, next) => {
  ctx.code = 'E_NO_FOUND';
  ctx.msg = '';
  ctx.data = null;

  try {
    await next();
  }
  catch (err) {
    debug('app:http:error')(err);

    switch (err.status || err.code) {
    case 401:
      ctx.code = 'E_UNAUTHORIZED';
      err.message = err.originalError ? err.originalError.message : err.message;
      break;
    default:
      ctx.code = 'E_INTERNAL_ERROR';
      ctx.status = err.status || 500;
      break;
    }

    ctx.msg = err.message || ctx.message;
    if (err.status) {
      ctx.status = err.status;
    }
    ctx.code = err.code || ctx.status;
  }

  if (!utils.isReadableContent(ctx.body) && (ctx.is('json') || ctx.accepts('json'))) {
    ctx.status = (ctx.code === 'E_NO_FOUND' ? ((ctx.data || ctx.body ) ? 200 : 404) : ctx.status);

    let response = {};

    response.msg = ctx.msg || ctx.message;
    response.code = ctx.status === 200 ? 'SUCCESS' : (ctx.code || ctx.status);
    response.result = (ctx.data || ctx.body || null);
    response.meta = {};

    if (ctx.startDate) {
      response.meta.duration = (Date.now() - ctx.startDate) + 'ms';
    }

    if (process.env.npm_package_version) {
      response.meta.appVersion = process.env.npm_package_version;
    }

    if (ctx.metaData) {
      response.meta.data = ctx.metaData;
    }
    
    ctx.body = response;
  }
};