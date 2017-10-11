'use strict';
/**
 * Require module dependencies.
 */

const debug = require('debug');
const utils = require('../utils');

/**
* Define log types.
*/

const logRes = debug('app:http:Response');
const logReq = debug('app:http:Request');
const logJSON = debug('app:http:JSON');

module.exports = async (ctx, next) => {
  const startDate = Date.now();
  ctx.startDate = startDate;
  
  /* Secure X-Forwarded-For remote IP, credits to Rilke Petrosky (https://github.com/xenomuta) */
    
  if(ctx.get('X-Real-IP') && ctx.ips.length > 0 && process.env.NODE_ENV === 'production') {
    ctx.request.safeIP = ctx.get('X-Real-IP');
  }

  ctx.request.safeIP = ctx.request.safeIP || ctx.request.ip;
  
  if (debug.enabled('app:http:Request')) {
    logReq(`[${ new Date() }] ${ ctx.request.safeIP } | ${ ctx.request.method } ${ ctx.request.url }`);
    logReq(`Headers: ${ JSON.stringify(ctx.request.headers) }`);

    if (typeof(ctx.request.body) === 'object' && debug.enabled('app:http:JSON')) {
      logJSON(`Req: ${ ctx.request.method } ${ ctx.request.url } => ${ JSON.stringify(ctx.request.body) }`);
    }
  }

  await next();
  
  const ms = Date.now() - startDate;
  
  if (debug.enabled('app:http:Response')) {
    let fileType = '', jsonLog = false, body = ctx.body;

    if (utils.isReadableContent(body) && body.path) {
      fileType += ` | Serving file => ${ body.path.replace(process.env.PWD + '/', '', 'g') }`;
    }
    else {
      jsonLog = true;
    }

    logRes(`[${ new Date() }] ${ ctx.request.safeIP } | ${ ctx.request.method } ${ ctx.request.url } (${ ms } ms) | ${ ctx.response.status }${ fileType }`);
    logRes(`Headers: ${ JSON.stringify(ctx.response.headers) }`);
    
    if (jsonLog && debug.enabled('app:http:JSON') && ctx.body) {
      if (utils.isReadableContent(body)) {
        body = await utils.readableToString(body);
      }
      else {
        body = JSON.stringify(body);
      }

      logJSON(`Res: ${ ctx.request.method } ${ ctx.request.url } | ${ ctx.response.status } => ${ body }`);
    }
  }
};
