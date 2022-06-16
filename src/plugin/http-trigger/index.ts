import http, { Server, IncomingMessage, ServerResponse } from 'http';
import { ArtusApplication, LifecycleHookUnit, ApplicationLifecycle, LifecycleHook } from '@artus/core';
import OriginHttpRequest from './lib/origin_http_request';

@LifecycleHookUnit()
export default class BootTrap implements ApplicationLifecycle {
  private server: Server;
  private app: ArtusApplication;

  constructor() {
    this.server = http
      .createServer(async (req: IncomingMessage, res: ServerResponse) => {
        const ctx = await this.app.trigger.startPipeline();
        // ctx.container.set({ type: OriginHttpRequest, args: [req] });
        console.log(ctx, req, res);
      });
  }

  @LifecycleHook()
  configDidLoad() {
    console.log(12333, 'start');
  }

  @LifecycleHook()
  beforeClose() {
    this.server?.close();
  }
}
