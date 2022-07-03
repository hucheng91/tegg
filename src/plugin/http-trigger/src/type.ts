
import { Constructable } from '@artus/injection';
import { HTTPMethodEnum } from './constant';

export type ControllerParams = {
  prefix?: string;
};

export type HttpParams = {
  method: HTTPMethodEnum;
  path: string;
};

export type ControllerMeta = {
  prefix: string;
  clazz: Constructable;
};

export type MiddlewareMeta = {
  clazz: Constructable;
};

export type MiddlewareParams = {
  path?: string;
};
