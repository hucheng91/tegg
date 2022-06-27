import 'reflect-metadata';

import { Injectable, ScopeEnum } from '@artus/injection';
import { ControllerParams, HttpParams } from './type';
import { HOOK_HTTP_META_PREFIX } from './constant';
import { controllerMap } from './utils/index';

export function HttpController(options?: ControllerParams): ClassDecorator {
  const prefix = options?.path ?? '';
  return (target: any) => {
    controllerMap.add({ prefix, clazz: target });
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

export function HttpMethod(options: HttpParams): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    if (typeof propertyKey === 'symbol') {
      throw new Error(`http hookName is not support symbol [${propertyKey.description}]`);
    }
    Reflect.defineMetadata(`${HOOK_HTTP_META_PREFIX}${propertyKey}`, options, target.constructor);
  };
}

