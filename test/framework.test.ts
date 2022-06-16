import 'reflect-metadata';
import assert from 'assert';
import { Server } from 'http';
import { createApp } from './fixtures/utils';
import { ORIGIN_SERVER } from '../src/index';
import { ArtusApplication } from '@artus/core';

describe('test/framework.test.ts', function() {
  describe('simple app', () => {
    let app: ArtusApplication;
    afterEach(function() {
      app.close();
    });

    it('should start success with tegg', async function() {
      app = await createApp('simple', { debug: false });
      const server = app.getContainer().get(ORIGIN_SERVER) as Server;
      assert(server.listening);
    });
  });
});
