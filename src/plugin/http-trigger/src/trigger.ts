import { Context, Next } from '@artus/pipeline';
import { Trigger, DefineTrigger } from '@artus/core';
import { KOA_CONTEXT, TEGG_OUTPUT } from './constant';
import { DefaultContext } from './thridparty/index';

@DefineTrigger()
export default class HttpTrigger extends Trigger {
  constructor() {
    super();
    // first of all
    this.use(async (ctx: Context, next: Next) => {
      await next();
      await this.respond(ctx);
    });
  }

  async respond(ctx: Context) {
    const response: any = ctx.container.get(TEGG_OUTPUT);
    const koaCtx = ctx.container.get<DefaultContext>(KOA_CONTEXT);
    if (response.body) {
      koaCtx.body = response.body;
      koaCtx.status = response.status || koaCtx.status;
      response.headers && Object.entries(response.headers).forEach(([ key, value ]) => koaCtx.set(key, value));
      return;
    }
    koaCtx.body = response;
  }
}
