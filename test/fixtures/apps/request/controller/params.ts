import {
  HttpController, HttpMethod, HTTPMethodEnum,
  WithParams, WithQuery, WithBody,
} from '../../../../../src';

type Args = {
  id: string;
};

@HttpController()
export default class PathController {
  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/params/:id',
  })
  async getParams(@WithParams() params:Args) {
    return params.id;
  }

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/query',
  })
  async getQuery(@WithQuery() query:Args) {
    return query.id;
  }

  @HttpMethod({
    method: HTTPMethodEnum.POST,
    path: '/body',
  })
  async getBody(@WithBody() body: Args) {
    return body.id;
  }

  @HttpMethod({
    method: HTTPMethodEnum.POST,
    path: '/all/:id',
  })
  async getAll(@WithParams() params: Args, @WithQuery() query: Args, @WithBody() body: Args) {
    return `${params.id}-${query.id}-${body.id}`;
  }
}
