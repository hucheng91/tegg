import http, { Server } from 'http';
import detect from 'detect-port';
import { DefaultContext, KoaApplication, registerKoaMiddleware } from './thridparty/index';
import {
  ArtusApplication, LifecycleHookUnit,
  ApplicationLifecycle, LifecycleHook, WithApplication, WithContainer,
} from '@artus/core';
import { Container } from '@artus/injection';
import {
  ORIGIN_SERVER, KOA_APPLICATION, KOA_ROUTER, KOA_CONTEXT, TEGG_CONTEXT,
  REQUEST, RESPONSE,
} from './constant';
import { registerMiddleware, registerController, controllerMap } from './utils/index';
import HttpTrigger from './trigger';
import KoaRouter from './thridparty/router';

@LifecycleHookUnit()
export default class BootStrap implements ApplicationLifecycle {
  private server: Server;
  private app: ArtusApplication;
  private container: Container;

  constructor(@WithApplication() app: ArtusApplication, @WithContainer() container: Container) {
    this.app = app;
    this.container = container;
  }

  get koaApp(): KoaApplication {
    return this.container.get(KoaApplication);
  }

  get koaRouter(): KoaRouter {
    return this.container.get(KoaRouter);
  }

  @LifecycleHook('willReady')
  async initKoa() {
    this.container.set({ id: KOA_APPLICATION, value: this.koaApp });
    this.container.set({ id: KOA_ROUTER, value: this.koaRouter });

    this.koaApp.use(async (koaCtx: DefaultContext, next) => {
      const ctx = await this.app.trigger.initContext();
      koaCtx.teggCtx = ctx;

      // set execution container
      ctx.container.set({ id: TEGG_CONTEXT, value: ctx });
      ctx.container.set({ id: KOA_CONTEXT, value: koaCtx });
      ctx.container.set({ id: REQUEST, value: koaCtx.request });
      ctx.container.set({ id: RESPONSE, value: koaCtx.response });

      await next();
    });

    registerKoaMiddleware(this.koaApp);
  }

  @LifecycleHook('willReady')
  async registerArtus() {
    registerMiddleware(this.app.trigger as HttpTrigger, this.container);

    registerController(this.app.trigger as HttpTrigger, this.container);
    this.koaApp.use(this.koaRouter.routes());
    this.koaApp.use(this.koaRouter.allowedMethods());
  }

  @LifecycleHook()
  async didReady() {
    const config = this.app.config;
    const port = config.port;
    const detected = await detect(port);
    if (detected !== port) {
      console.log(`port: ${port} was occupied, try port: ${detected}`);
      config.port = detected;
    }

    this.server = http.createServer(this.koaApp.callback());
    await new Promise(resolve => this.server.listen(config.port, () => resolve(true)));
    console.log(`Server start listening at ${config.port}.`);
  }

  @LifecycleHook('didReady')
  async registerHttpServer() {
    this.container.set({ id: ORIGIN_SERVER, value: this.server });
  }

  @LifecycleHook()
  async beforeClose() {
    this.server?.close();
    controllerMap.clear();
  }
}
