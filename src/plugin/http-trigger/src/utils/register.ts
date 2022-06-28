import { DefaultContext } from 'koa';
import { Container, ScopeEnum, Constructable } from '@artus/injection';
import { Context, Next } from '@artus/pipeline';
import { ControllerMeta } from '../type';
import HttpTrigger from '../trigger';
import { KOA_ROUTER, HOOK_HTTP_META_PREFIX, TEGG_OUTPUT, TEGG_ROUTER } from '../constant';
import KoaRouter from '../thridparty/router';

type TeggRouter = {
  clazz: Constructable,
  attr: string,
};

export const controllerMap = new Set<ControllerMeta>();

export function registerController(trigger: HttpTrigger, container: Container) {
  for (const controller of controllerMap) {
    const { prefix, clazz } = controller;
    const router: KoaRouter = container.get(KOA_ROUTER);

    const fnMetaKeys = Reflect.getMetadataKeys(clazz);

    for (let key of fnMetaKeys) {
      if (typeof key !== 'string') {
        continue;
      }
      if (!key.startsWith(HOOK_HTTP_META_PREFIX)) {
        continue;
      }

      // register tegg controller
      const { method, path } = Reflect.getMetadata(key, clazz);
      key = key.replace(HOOK_HTTP_META_PREFIX, '');

      // register koa controller
      const koaMiddleware = async function(koaCtx: DefaultContext) {
        const { teggCtx } = koaCtx;
        const router: TeggRouter = { attr: key, clazz };
        teggCtx.container.set({ id: TEGG_ROUTER, value: router, scope: ScopeEnum.EXECUTION });
        await trigger.startPipeline(teggCtx);
      };
      if (prefix) {

      } else {
        router[method.toLowerCase()](path, koaMiddleware);
      }
    }
  }

  const teggMiddleware = async function(ctx: Context, next: Next) {
    const { attr, clazz } = ctx.container.get(TEGG_ROUTER) as TeggRouter;
    const instance: any = ctx.container.get(clazz);
    const output = await instance[attr]();
    ctx.container.set({ id: TEGG_OUTPUT, value: output, scope: ScopeEnum.EXECUTION });
    await next();
  };
  trigger.use(teggMiddleware);
}
