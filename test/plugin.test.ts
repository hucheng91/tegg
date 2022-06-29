import 'reflect-metadata';
import assert from 'assert';
import { Server } from 'http';
import { createApp } from './fixtures/utils';
import { ORIGIN_SERVER } from '../src/index';
import { ArtusApplication } from '@artus/core';
import axios from 'axios';
import { startRedisServer, RedisServer } from './fixtures/thirdparty/redis';

describe('test/plugin.test.ts', function() {
  describe('plugin', () => {
    let app: ArtusApplication;
    let server: RedisServer;

    beforeEach(async function() {
      app = await createApp('plugin', { debug: false });
      server = await startRedisServer(6666);
    });

    afterEach(async function() {
      await app.close();
      await server.close();
    });

    it('plugin redis should set / get succeed', async function() {
      const server = app.getContainer().get<Server>(ORIGIN_SERVER);
      assert(server.listening);

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
    });
  });

});
