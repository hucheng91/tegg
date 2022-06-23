import { IncomingMessage } from 'http';
import { Context, Next } from '@artus/pipeline';
import { CONSTRUCTOR_PARAMS, CONSTRUCTOR_PARAMS_CONTEXT } from '@artus/core';
import { HOOK_HTTP_META_PREFIX, ORIGIN_REQ } from './constant';
import { ControllerMeta } from './type';
import HttpTrigger from './trigger';

export const controllerMap = new Set<ControllerMeta>();

export function registerController(trigger: HttpTrigger) {
  for (const controller of controllerMap) {
    const { prefix, clazz } = controller;
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

      // match router
      trigger.use(async (ctx: Context, next: Next) => {
        const req = ctx.container.get(ORIGIN_REQ) as IncomingMessage;
        if (req.url === `${prefix}${path}` && req.method === method) {
          const instance: any = ctx.container.get(clazz);
          const target = instance[key];
          const params: any = Reflect.getMetadata(CONSTRUCTOR_PARAMS, target) ?? [];
          const paramsMap = {
            [CONSTRUCTOR_PARAMS_CONTEXT]: ctx,
          };
          ctx.output.data.content = await target.call(instance, ...params.map(param => paramsMap[param]));
        }
        await next();
      });
    }
  }
}
