import { Container, Constructable } from '@artus/injection';
import { Context, Next } from '@artus/pipeline';
import { ControllerMeta } from '../type';
import HttpTrigger from '../trigger';
import { DefaultContext } from '../thridparty/index';
import {
  KOA_ROUTER, HOOK_HTTP_META_PREFIX, TEGG_OUTPUT, TEGG_ROUTER,
  KOA_CONTEXT, PARAMS, QUERY, BODY, HOOK_CONTROLLER_PARAMS_PREFIX,
} from '../constant';
import KoaRouter from '../thridparty/router';

type TeggRouter = {
  clazz: Constructable,
  attr: string,
};

export const controllerMap = new Set<ControllerMeta>();

export function registerController(trigger: HttpTrigger, container: Container) {
  for (const controller of controllerMap) {
    const { prefix, clazz } = controller;
    const router = container.get<KoaRouter>(KOA_ROUTER);

    const fnMetaKeys = Reflect.getMetadataKeys(clazz);
    const childRouter = router.instance();

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
        teggCtx.container.set({ id: TEGG_ROUTER, value: router });
        await trigger.startPipeline(teggCtx);
      };
      if (prefix) {
        childRouter[method.toLowerCase()](path, koaMiddleware);
      } else {
        router[method.toLowerCase()](path, koaMiddleware);
      }
    }

    if (prefix) {
      router.use(prefix, childRouter.routes());
    }
  }

  const teggMiddleware = async function(ctx: Context, next: Next) {
    registerParams(ctx.container);
    const { attr, clazz } = ctx.container.get<TeggRouter>(TEGG_ROUTER);
    const instance = ctx.container.get<Constructable>(clazz);

    const koaCtx = ctx.container.get<DefaultContext>(KOA_CONTEXT);
    const inject = {
      [PARAMS]: koaCtx.params,
      [QUERY]: koaCtx.query,
      [BODY]: koaCtx.request.body,
    };
    const params = Reflect.getMetadata(`${HOOK_CONTROLLER_PARAMS_PREFIX}${attr}`, clazz) ?? [];
    const args = params.map((key: string) => inject[key]);
    const output = await instance[attr](...args);
    ctx.container.set({ id: TEGG_OUTPUT, value: output });
    await next();
  };
  trigger.use(teggMiddleware);
}

export function registerParams(container: Container) {
  const koaCtx = container.get<DefaultContext>(KOA_CONTEXT);

  container.set({ id: QUERY, value: koaCtx.query });
  container.set({ id: PARAMS, value: koaCtx.params });
  container.set({ id: BODY, value: koaCtx.request.body });
}
