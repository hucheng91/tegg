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

    beforeEach(async function() {
      app = await createApp('simple-app', { debug: false });
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

  describe('access with injected request', () => {
    let app: ArtusApplication;

    beforeEach(async function() {
      app = await createApp('request', { debug: false });
    });

    afterEach(async function() {
      await app.close();
    });

    it('should get response with tegg succeed', async function() {
      const server = app.getContainer().get<Server>(ORIGIN_SERVER);
      assert(server.listening);

      const path = '/whoiam';
      const response1 = await axios.get(`http://127.0.0.1:${app.config.port}${path}`);
      assert(response1.status === 200);
      assert(response1.data === path);

      const response2 = await axios.get(`http://127.0.0.1:${app.config.port}/params/9527`);
      assert(response2.status === 200);
      assert(Number(response2.data) === 9527);

      const response3 = await axios.get(`http://127.0.0.1:${app.config.port}/query?id=9528`);
      assert(response3.status === 200);
      assert(Number(response3.data) === 9528);

      const response4 = await axios.post(`http://127.0.0.1:${app.config.port}/body`, { id: 9529 });
      assert(response4.status === 200);
      assert(Number(response4.data) === 9529);

      const response5 = await axios.post(`http://127.0.0.1:${app.config.port}/all/1?id=2`, { id: 3 });
      assert(response5.status === 200);
      assert(response5.data === '1-2-3');
    });
  });

  describe('child router', () => {
    let app: ArtusApplication;

    beforeEach(async function() {
      app = await createApp('router', { debug: false });
    });

    afterEach(async function() {
      await app.close();
    });

    it('should get response with tegg succeed', async function() {
      const server = app.getContainer().get<Server>(ORIGIN_SERVER);
      assert(server.listening);

      const response1 = await axios.get(`http://127.0.0.1:${app.config.port}/router1/foo`);
      assert(response1.status === 200);
      assert(response1.data === 'router1 foo');

      const response2 = await axios.get(`http://127.0.0.1:${app.config.port}/router1/bar`);
      assert(response2.status === 200);
      assert(response2.data === 'router1 bar');

      const response3 = await axios.get(`http://127.0.0.1:${app.config.port}/router2/foo`);
      assert(response3.status === 200);
      assert(response3.data === 'router2 foo');

      const response4 = await axios.get(`http://127.0.0.1:${app.config.port}/router2/bar`);
      assert(response4.status === 200);
      assert(response4.data === 'router2 bar');
    });
  });
});
