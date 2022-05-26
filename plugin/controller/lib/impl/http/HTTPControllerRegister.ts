import assert from 'assert';
import KoaRouter from 'koa-router';
import { Application, Context } from 'egg';
import {
  CONTROLLER_META_DATA,
  ControllerMetadata,
  ControllerType,
  HTTPControllerMeta,
  HTTPMethodMeta,
} from '@eggjs/tegg';
import { EggPrototype } from '@eggjs/tegg-metadata';
import { ControllerRegister } from '../../ControllerRegister';
import { HTTPMethodRegister } from './HTTPMethodRegister';
import { EggContainerFactory } from '@eggjs/tegg-runtime';
import { RootProtoManager } from '../../RootProtoManager';

export class HTTPControllerRegister implements ControllerRegister {
  static instance: Map<Application, HTTPControllerRegister> = new Map();

  private readonly router: KoaRouter<any, Context>;
  private readonly eggContainerFactory: typeof EggContainerFactory;
  private controllerProtos: EggPrototype[] = [];

  static create(proto: EggPrototype, controllerMeta: ControllerMetadata, app: Application) {
    assert(controllerMeta.type === ControllerType.HTTP, 'controller meta type is not HTTP');
    if (!HTTPControllerRegister.instance.has(app)) {
      HTTPControllerRegister.instance.set(app, new HTTPControllerRegister(app.router, app.eggContainerFactory));
    }
    const instance = HTTPControllerRegister.instance.get(app)!;
    instance.controllerProtos.push(proto);
    return instance;
  }

  static clean(app: Application) {
    if (!this.instance.has(app)) return;

    this.instance.get(app)!.controllerProtos = [];
    this.instance.delete(app);
  }

  static doRegister(app: Application, rootProtoManager: RootProtoManager) {
    if (!this.instance.has(app)) return;
    this.instance.get(app)!.doRegister(rootProtoManager);
  }

  constructor(router: KoaRouter<any, Context>, eggContainerFactory: typeof EggContainerFactory) {
    this.router = router;
    this.eggContainerFactory = eggContainerFactory;
  }

  register(): Promise<void> {
    // do noting
    return Promise.resolve();
  }

  doRegister(rootProtoManager: RootProtoManager) {
    const methodMap = new Map<HTTPMethodMeta, EggPrototype>();
    for (const proto of this.controllerProtos) {
      const metadata = proto.getMetaData(CONTROLLER_META_DATA) as HTTPControllerMeta;
      for (const method of metadata.methods) {
        methodMap.set(method, proto);
      }
    }
    const allMethods = Array.from(methodMap.keys())
      .sort((a, b) => b.priority - a.priority);
    for (const method of allMethods) {
      const controllerProto = methodMap.get(method)!;
      const controllerMeta = controllerProto.getMetaData(CONTROLLER_META_DATA) as HTTPControllerMeta;
      const methodRegister = new HTTPMethodRegister(
        controllerProto, controllerMeta, method, this.router, this.eggContainerFactory);
      methodRegister.register(rootProtoManager);
    }
  }
}
