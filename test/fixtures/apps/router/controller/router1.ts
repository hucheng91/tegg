import { HttpController, HttpMethod, HTTPMethodEnum } from '../../../../../src';

@HttpController({ prefix: '/router1' })
export default class HelloController {
  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/foo',
  })
  async foo() {
    return 'router1 foo';
  }

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/bar',
  })
  async bar() {
    return 'router1 bar';
  }
}
