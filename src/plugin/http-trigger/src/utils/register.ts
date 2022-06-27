import { Container } from '@artus/injection';
import { ControllerMeta } from '../type';
import HttpTrigger from '../trigger';
import { KOA_ROUTER, HOOK_HTTP_META_PREFIX } from '../constant';
import KoaRouter from '../thridparty/router';

export const controllerMap = new Set<ControllerMeta>();

export function registerController(trigger: HttpTrigger, container: Container) {
  for (const controller of controllerMap) {
    const { prefix, clazz } = controller;
    const instance: any = container.get(clazz);
    const router: KoaRouter = container.get(KOA_ROUTER);

    const fnMetaKeys = Reflect.getMetadataKeys(clazz);

    for (let key of fnMetaKeys) {
      if (typeof key !== 'string') {
        continue;
      }
      if (!key.startsWith(HOOK_HTTP_META_PREFIX)) {
        continue;
      }

      // register controller
      const { method, path } = Reflect.getMetadata(key, clazz);
      key = key.replace(HOOK_HTTP_META_PREFIX, '');
      const fn = async function (ctx) {
        const output = await instance[key]();
        console.log(12333, trigger, output);
        ctx.body = output;
      };
      if (prefix) {

      } else {
        router[method.toLowerCase()](path, fn);
      }

      console.log(12333, router)

      // match router
      // trigger.use(async (ctx: Context, next: Next) => {
      //   const req = ctx.container.get(ORIGIN_REQ) as IncomingMessage;
      //   if (req.url === `${prefix}${path}` && req.method === method) {
      //     const instance: any = ctx.container.get(clazz);
      //     const target = instance[key];
      //     const params: any = Reflect.getMetadata(CONSTRUCTOR_PARAMS, target) ?? [];
      //     const paramsMap = {
      //       [CONSTRUCTOR_PARAMS_CONTEXT]: ctx,
      //     };
      //     ctx.output.data.content = await target.call(instance, ...params.map(param => paramsMap[param]));
      //   }
      //   await next();
      // });
    }
  }
}
