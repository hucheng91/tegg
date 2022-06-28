import { Context, Next } from '@artus/pipeline';
import { Trigger, DefineTrigger } from '@artus/core';
import { KOA_CONTEXT, TEGG_OUTPUT } from './constant';

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
    const response = ctx.container.get(TEGG_OUTPUT);
    const koaCtx: any = ctx.container.get(KOA_CONTEXT);
    koaCtx.body = response;
  }
}
