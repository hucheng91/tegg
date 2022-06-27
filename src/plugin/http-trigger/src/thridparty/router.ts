import { Injectable } from '@artus/injection';
import Router from '@koa/router';

@Injectable()
export default class KoaRouter extends Router {
  instance() {
    return new KoaRouter();
  }
}
