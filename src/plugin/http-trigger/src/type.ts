
import { Constructable } from '@artus/injection';
import { HTTPMethodEnum } from './constant';

export type ControllerParams = {
  path?: string
};

export type HttpParams = {
  method: HTTPMethodEnum,
  path: string
};

export type ControllerMeta = {
  prefix: string,
  clazz: Constructable
};
