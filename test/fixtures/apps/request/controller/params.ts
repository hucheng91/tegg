import { Inject } from '@artus/core';
import {
  HttpController, HttpMethod, HTTPMethodEnum,
  Params, PARAMS, Query, QUERY, Body, BODY,
} from '../../../../../src';

@HttpController()
export default class PathController {
  @Inject(PARAMS)
  private params: Params;
  @Inject(QUERY)
  private query: Query;
  @Inject(BODY)
  private body: Body;

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

  @HttpMethod({
    method: HTTPMethodEnum.POST,
    path: '/body',
  })
  async getBody() {
    return this.body.id;
  }
}
