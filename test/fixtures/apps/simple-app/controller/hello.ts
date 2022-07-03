import { HttpController, HttpMethod, HTTPMethodEnum } from '../../../../../src';

@HttpController()
export default class HelloController {
  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/home',
  })
  async home() {
    return 'new tegg home.';
  }
}
