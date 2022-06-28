import { Inject } from '@artus/core';
import {
  HttpController, HttpMethod, HTTPMethodEnum,
  Params, PARAMS, Query, QUERY,
} from '../../../../../src';

@HttpController()
export default class PathController {
  @Inject(PARAMS)
  private params: Params;
  @Inject(QUERY)
  private query: Query;

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/params/:id',
  })
  async getParams() {
    return this.params.id;
  }

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/query',
  })
  async getQuery() {
    return this.query.id;
  }
}
