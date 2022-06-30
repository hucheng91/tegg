import { Inject } from '@artus/core';
import { HttpController, HttpMethod, HTTPMethodEnum, WithBody, WithParams } from '../../../../../src';
import { MultiClients } from '../plugin/redis/src';

@HttpController()
export default class MultiRedisController {
  @Inject()
  private clients: MultiClients;

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/multi-redis/:client/:key/:value',
  })
  async testSet(@WithParams() params: { client: string, key: string; value: string }) {
    const redis = this.clients.get(params.client);
    await redis.set(params.key, params.value);
    return 'ok';
  }

  @HttpMethod({
    method: HTTPMethodEnum.POST,
    path: '/multi-redis',
  })
  async testGet(@WithBody() body: { client: string, key: string }) {
    const redis = this.clients.get(body.client);
    return await redis.get(body.key);
  }

  @HttpMethod({
    method: HTTPMethodEnum.DELETE,
    path: '/multi-redis',
  })
  async testDel(@WithBody() body: { client: string, key: string }) {
    const redis = this.clients.get(body.client);
    await redis.del(body.key);
    return 'ok';
  }
}
