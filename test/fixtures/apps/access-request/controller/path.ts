import { Inject } from '@artus/core';
import { Request } from 'koa';
import { HttpController, HttpMethod, HTTPMethodEnum, REQUEST } from '../../../../../src';

@HttpController()
export default class PathController {
  @Inject(REQUEST)
  private req: Request;

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/whoiam',
  })
  async whoiam() {
    return this.req.path;
  }

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/params/:id',
  })
  async params() {
    console.log(123333, this.req.url, this.req.ctx.params);
    return this.req.ctx.params.id;
  }
}
