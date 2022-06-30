import {
  ArtusApplication, LifecycleHookUnit,
  ApplicationLifecycle, LifecycleHook, WithApplication, WithContainer,
} from '@artus/core';
import { Container } from '@artus/injection';
import { Redis, RedisOptions, MultiClients } from './type';

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

    if (client) {
      this.container.set({ id: Redis, value: new Redis(client) });
    }

    if (clients) {
      const multiClients = new MultiClients();
      Object
        .entries(clients)
        .forEach(([ key, options ]) => multiClients.set(key, new Redis(options)));
      this.container.set({ id: MultiClients, value: multiClients });
    }
  }

  @LifecycleHook()
  async beforeClose() {
    try {
      this.container.get(Redis).disconnect();
      this.container.get(MultiClients).clean();
    } catch (e) { e; }
  }
}
