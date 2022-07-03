import { Inject } from '@artus/core';
import { HttpController, HttpMethod, HTTPMethodEnum, WithBody, WithParams } from '../../../../../src';
import { Redis } from '../plugin/redis/src';

@HttpController()
export default class RedisController {
  @Inject()
  private redis: Redis;

  @HttpMethod({
    method: HTTPMethodEnum.GET,
    path: '/redis/:key/:value',
  })
  async testSet(@WithParams() params: { key: string; value: string }) {
    await this.redis.set(params.key, params.value);
    return 'ok';
  }

  @HttpMethod({
    method: HTTPMethodEnum.POST,
    path: '/redis',
  })
  async testGet(@WithBody() body: { key: string }) {
    return await this.redis.get(body.key);
  }

  @HttpMethod({
    method: HTTPMethodEnum.DELETE,
    path: '/redis',
  })
  async testDel(@WithBody() body: { key: string }) {
    await this.redis.del(body.key);
    return 'ok';
  }
}
