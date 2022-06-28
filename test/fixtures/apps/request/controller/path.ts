import { Inject } from '@artus/core';
import {
  HttpController, HttpMethod, HTTPMethodEnum, Request, REQUEST,
} from '../../../../../src';

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
}
