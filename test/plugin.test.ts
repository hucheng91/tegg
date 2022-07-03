import 'reflect-metadata';
import assert from 'assert';
import { Server } from 'http';
import { createApp } from './fixtures/utils';
import { ORIGIN_SERVER } from '../src/index';
import { ArtusApplication } from '@artus/core';
import axios from 'axios';
import { startRedisServer, RedisServer } from './fixtures/thirdparty/redis';

describe('test/plugin.test.ts', function() {
  describe('plugin redis with single & multi client(s)', () => {
    let app: ArtusApplication;
    const server: RedisServer[] = [];

    beforeAll(async function() {
      app = await createApp('simple-plugin', { debug: false });
      server.push(await startRedisServer(6666));
      server.push(await startRedisServer(6667));
      server.push(await startRedisServer(6668));
    });

    afterAll(async function() {
      await app.close();
      await Promise.all(server.map(s => s.close()));
    });

    it('should set / get / del succeed', async function() {
      const server = app.getContainer().get<Server>(ORIGIN_SERVER);
      assert(server.listening);

      // single client
      {
        const key = 'foo';
        const val = 'bar';
        const response1 = await axios.get(`http://127.0.0.1:${app.config.port}/redis/${key}/${val}`);
        assert(response1.status === 200);
        assert(response1.data === 'ok');

        const response2 = await axios.post(`http://127.0.0.1:${app.config.port}/redis`, { key });
        assert(response2.status === 200);
        assert(response2.data === val);

        const response3 = await axios.delete(`http://127.0.0.1:${app.config.port}/redis`, { data: { key } });
        assert(response3.status === 200);
        assert(response3.data === 'ok');
      }

      // multi clients
      {
        const key1 = 'foo1';
        const val1 = 'bar1';
        const response1 = await axios.get(`http://127.0.0.1:${app.config.port}/multi-redis/c1/${key1}/${val1}`);
        assert(response1.status === 200);
        assert(response1.data === 'ok');

        const response2 = await axios.post(`http://127.0.0.1:${app.config.port}/multi-redis`, { client: 'c1', key: key1 });
        assert(response2.status === 200);
        assert(response2.data === val1);

        const response3 = await axios.delete(`http://127.0.0.1:${app.config.port}/multi-redis`, { data: { client: 'c1', key: key1 } });
        assert(response3.status === 200);
        assert(response3.data === 'ok');

        const key2 = 'foo2';
        const val2 = 'bar2';
        const response4 = await axios.get(`http://127.0.0.1:${app.config.port}/multi-redis/c2/${key2}/${val2}`);
        assert(response4.status === 200);
        assert(response4.data === 'ok');

        const response5 = await axios.post(`http://127.0.0.1:${app.config.port}/multi-redis`, { client: 'c2', key: key2 });
        assert(response5.status === 200);
        assert(response5.data === val2);

        const response6 = await axios.delete(`http://127.0.0.1:${app.config.port}/multi-redis`, { data: { client: 'c2', key: key2 } });
        assert(response6.status === 200);
        assert(response6.data === 'ok');
      }
    });
  });
});
