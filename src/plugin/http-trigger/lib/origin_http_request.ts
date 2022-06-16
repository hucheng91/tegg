import { IncomingMessage } from 'http';
import { Injectable } from '@artus/core';
import { ScopeEnum } from '@artus/injection';

@Injectable({
  scope: ScopeEnum.EXECUTION
})
export default class OriginHttpRequest {
  constructor(req: IncomingMessage) {
    const proxy = new Proxy(req, {
      get(target, key, recv) {
        return Reflect.get(target, key, recv);
      },
    });

    return proxy;
  }
}
