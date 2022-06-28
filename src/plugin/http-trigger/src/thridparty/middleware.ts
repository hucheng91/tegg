import bodyparser from 'koa-bodyparser';
import KoaApplication from './koa';

export function registerKoaMiddleware(koaApp: KoaApplication) {
  // bodyparser
  koaApp.use(bodyparser());
}
