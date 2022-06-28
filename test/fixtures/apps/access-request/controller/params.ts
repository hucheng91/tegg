import { Inject } from '@artus/core';
import {
  HttpController, HttpMethod, HTTPMethodEnum, PARAMS,
} from '../../../../../src';

@HttpController()
export default class PathController {
  @Inject(PARAMS)
  private params;

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/params/:id',
  })
  async getpPrams() {
    return this.params.id;
  }
}
