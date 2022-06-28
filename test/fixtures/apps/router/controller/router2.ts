import { HttpController, HttpMethod, HTTPMethodEnum } from '../../../../../src';

@HttpController({ prefix: '/router2' })
export default class HelloController {
  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/foo',
  })
  async foo() {
    return 'router2 foo';
  }

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/bar',
  })
  async bar() {
    return 'router2 bar';
  }
}
