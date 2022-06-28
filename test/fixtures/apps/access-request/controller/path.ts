import { Inject } from '@artus/core';
import { IncomingMessage } from 'http';
import { HttpController, HttpMethod, HTTPMethodEnum, REQUEST } from '../../../../../src';

@HttpController()
export default class PathController {
  @Inject(REQUEST)
  private req: IncomingMessage;

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/whoiam',
  })
  async all() {
    return this.req.url;
  }
}
