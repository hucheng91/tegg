import {
  ArtusApplication, LifecycleHookUnit,
  ApplicationLifecycle, LifecycleHook, WithApplication, WithContainer,
} from '@artus/core';
import { Container } from '@artus/injection';
import Redis, { RedisOptions } from 'ioredis';

@LifecycleHookUnit()
export default class RedisInitialization implements ApplicationLifecycle {
  private app: ArtusApplication;
  private container: Container;

  constructor(@WithApplication() app: ArtusApplication, @WithContainer() conainer: Container) {
    this.app = app;
    this.container = conainer;
  }

  @LifecycleHook()
  async configDidLoad() {
    const config = this.app.config.redis;
    const client: RedisOptions = config.client;
    const clients: Record<string, RedisOptions> = config.clients;

    if (clients) {
      Object
        .entries(clients)
        .reduce((pre, [ key, conf ]) => pre.set(key, new Redis(conf)), new Map<string, Redis>());
    } else {
      this.container.set({ id: Redis, value: new Redis(client) });
    }
  }

  @LifecycleHook()
  async beforeClose() {
    const config = this.app.config.redis;
    const clients: Record<string, RedisOptions> = config.clients;

    if (clients) {
      // (redis as RedisClients).forEach((client) => client.disconnect());
    } else {
      this.container.get(Redis).disconnect();
    }
  }
}
