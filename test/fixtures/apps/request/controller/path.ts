import { Inject } from '@artus/core';
import {
  HttpController, HttpMethod, HTTPMethodEnum, Request,
} from '../../../../../src';

@HttpController()
export default class PathController {
  @Inject()
  private req: Request;

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/whoiam',
  })
  async whoiam() {
    return this.req.path;
  }
}
