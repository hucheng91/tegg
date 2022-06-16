import http, { Server, IncomingMessage, ServerResponse } from 'http';
import detect from 'detect-port';
import { ArtusApplication, LifecycleHookUnit, ApplicationLifecycle, LifecycleHook, WithApplication } from '@artus/core';
import { ORIGIN_SERVER, ORIGIN_REQ, ORIGIN_RES } from './constant';

@LifecycleHookUnit()
export default class BootTrap implements ApplicationLifecycle {
  private server: Server;
  private app: ArtusApplication;

  constructor(@WithApplication() app: ArtusApplication) {
    this.app = app;
    this.server = http
      .createServer(async (req: IncomingMessage, res: ServerResponse) => {
        const ctx = await this.app.trigger.startPipeline();
        ctx.container.set({ id: ORIGIN_REQ, value: req });
        ctx.container.set({ id: ORIGIN_RES, value: res });
      });
    app.getContainer().set({ id: ORIGIN_SERVER, value: this.server });
  }

  @LifecycleHook()
  async willReady() {
    const config = this.app.config;
    const port = config.port;
    const detected = await detect(port);
    if (detected !== port) {
      console.log(`port: ${port} was occupied, try port: ${detected}`);
      config.port = detected;
    }

    await new Promise(resolve => this.server.listen(config.port, () => resolve(true)));
    console.log(`Server start listening at ${config.port}.`);
  }

  @LifecycleHook()
  async beforeClose() {
    this.server?.close();
  }
}
