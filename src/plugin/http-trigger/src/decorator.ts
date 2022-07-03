import 'reflect-metadata';

import { Injectable, ScopeEnum } from '@artus/injection';
import { ControllerParams, HttpParams, MiddlewareParams } from './type';
import { HOOK_HTTP_META_PREFIX, HOOK_MIDDLEWARE_META_PREFIX, HOOK_CONTROLLER_PARAMS_PREFIX, PARAMS, QUERY, BODY } from './constant';
import { controllerMap, middlewareMap } from './utils/index';

export function HttpController(options?: ControllerParams): ClassDecorator {
  const prefix = options?.prefix ?? '';
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

export function Middleware(): ClassDecorator {
  return (target: any) => {
    middlewareMap.add({ clazz: target });
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

export function MiddlewareMethod(options: MiddlewareParams = {}): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    if (typeof propertyKey === 'symbol') {
      throw new Error(`middleware hookName is not support symbol [${propertyKey.description}]`);
    }
    Reflect.defineMetadata(`${HOOK_MIDDLEWARE_META_PREFIX}${propertyKey}`, options, target.constructor);
  };
}

export function DefineArgs(tag: string): ParameterDecorator {
  return (target: any, propertyKey: string | symbol, index: number) => {
    if (typeof propertyKey === 'symbol') {
      throw new Error(`http hookName is not support symbol [${propertyKey.description}]`);
    }
    const key = `${HOOK_CONTROLLER_PARAMS_PREFIX}${propertyKey}`;
    const params = Reflect.getMetadata(key, target.constructor) ?? [];
    params[index] = tag;
    Reflect.defineMetadata(key, params, target.constructor);
  };
}

export function WithParams(): ParameterDecorator {
  return DefineArgs(PARAMS);
}

export function WithQuery(): ParameterDecorator {
  return DefineArgs(QUERY);
}

export function WithBody(): ParameterDecorator {
  return DefineArgs(BODY);
}
