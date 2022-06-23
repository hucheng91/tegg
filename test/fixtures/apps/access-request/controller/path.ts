import { Inject } from '@artus/core';
import { IncomingMessage } from 'http';
import { HttpController, HttpMethod, HTTPMethodEnum, ORIGIN_REQ } from '../../../../../src';

@HttpController()
export default class HelloController {
  @Inject(ORIGIN_REQ)
  private req: IncomingMessage;

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/whoiam',
  })
  async all() {
    return this.req.url;
  }
}
