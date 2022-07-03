import { Middleware, MiddlewareMethod, Next } from '../../../../../src';

@Middleware()
export default class Logger {
  @MiddlewareMethod()
  async use(next: Next) {
    const start = Date.now();
    await next();
    const end = Date.now();
    console.log(`request cost: ${end - start}ms`);
  }
}
