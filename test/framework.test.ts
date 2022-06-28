import 'reflect-metadata';
import assert from 'assert';
import { Server } from 'http';
import { createApp } from './fixtures/utils';
import { ORIGIN_SERVER } from '../src/index';
import { ArtusApplication } from '@artus/core';
import axios from 'axios';

describe('test/framework.test.ts', function() {
  describe('simple app', () => {
    let app: ArtusApplication;
    afterEach(function() {
      app.close();
    });

    it('should start success with tegg', async function() {
      app = await createApp('simple', { debug: false });
      const server = app.getContainer().get<Server>(ORIGIN_SERVER);
      assert(server.listening);

      const response = await axios.get(`http://127.0.0.1:${app.config.port}/home`);
      assert(response.status === 200);
      assert(response.data === 'new tegg home.');
    });
  });

  describe('access with injected request', () => {
    let app: ArtusApplication;
    afterEach(function() {
      app.close();
    });

    it('should start success with tegg', async function() {
      app = await createApp('access-request', { debug: false });
      const server = app.getContainer().get<Server>(ORIGIN_SERVER);
      assert(server.listening);

      const path = '/whoiam';
      const response = await axios.get(`http://127.0.0.1:${app.config.port}${path}`);
      assert(response.status === 200);
      assert(response.data === path);

      const response2 = await axios.get(`http://127.0.0.1:${app.config.port}/params/9527`);
      assert(response2.status === 200);
      assert(Number(response2.data) === 9527);

      const response3 = await axios.get(`http://127.0.0.1:${app.config.port}/query?id=9527`);
      assert(response3.status === 200);
      assert(Number(response3.data) === 9527);
    });
  });
});
