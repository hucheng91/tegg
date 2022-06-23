import http, { Server, IncomingMessage, ServerResponse } from 'http';
import detect from 'detect-port';
import { ArtusApplication, LifecycleHookUnit, ApplicationLifecycle, LifecycleHook, WithApplication } from '@artus/core';
import { ScopeEnum } from '@artus/injection';
import { ORIGIN_SERVER, ORIGIN_REQ, ORIGIN_RES, TEGG_CONTEXT } from './constant';
import { registerController } from './decorator';
import HttpTrigger from './trigger';

@LifecycleHookUnit()
export default class BootTrap implements ApplicationLifecycle {
  private server: Server;
  private app: ArtusApplication;

  constructor(@WithApplication() app: ArtusApplication) {
    this.app = app;
    this.server = http
      .createServer(async (req: IncomingMessage, res: ServerResponse) => {
        const ctx = await this.app.trigger.initContext();
        ctx.input.params = { req, res };
        ctx.container.set({ id: ORIGIN_REQ, value: req, scope: ScopeEnum.EXECUTION });
        ctx.container.set({ id: ORIGIN_RES, value: res, scope: ScopeEnum.EXECUTION });
        ctx.container.set({ id: TEGG_CONTEXT, value: ctx, scope: ScopeEnum.EXECUTION });
        await this.app.trigger.startPipeline(ctx);
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
  async didReady() {
    registerController(this.app.trigger as HttpTrigger);
  }

  @LifecycleHook()
  async beforeClose() {
    this.server?.close();
  }
}
