
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

export type Params = {
  [key: string]: any
};

export type Query = {
  [key: string]: any
};
