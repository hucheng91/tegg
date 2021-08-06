import {
  HTTPController,
  HTTPMethod,
  HTTPMethodEnum,
} from '@eggjs/tegg';

@HTTPController({
  controllerName: 'AppController',
  path: '/apps',
})
export class AppController2 {
  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: '/:id',
  })
  async get() {
    return 'hello';
  }
}
