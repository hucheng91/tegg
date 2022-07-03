import 'reflect-metadata';
import assert from 'assert';
import { Server } from 'http';
import { createApp } from './fixtures/utils';
import { ORIGIN_SERVER } from '../src/index';
import { ArtusApplication } from '@artus/core';
import axios from 'axios';

describe('test/middleware.test.ts', function() {
  describe('simple middleware', () => {
    let app: ArtusApplication;

    beforeEach(async function() {
      app = await createApp('simple-middleware', { debug: false });
    });

    afterEach(async function() {
      await app.close();
    });

    it('should start success with tegg', async function() {
      const server = app.getContainer().get<Server>(ORIGIN_SERVER);
      assert(server.listening);

      const response = await axios.get(`http://127.0.0.1:${app.config.port}/home`);
      assert(response.status === 200);
      assert(response.data === 'new tegg home.');
    });
  });
});
