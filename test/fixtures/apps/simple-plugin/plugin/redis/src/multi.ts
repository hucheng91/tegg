import { Redis } from './type';


export default class MultiClients {
  private clients: Map<string, Redis> = new Map();

  get(key: string): Redis {
    const redis = this.clients.get(key);
    if (!redis) {
      throw new Error(`Redis client with key ${key} not found, please check your config.`);
    }
    return redis;
  }

  set(key: string, redis: Redis): void {
    this.clients.set(key, redis);
  }

  values(): Redis[] {
    const clients: Redis[] = [];
    for (const redis of this.clients.values()) {
      clients.push(redis);
    }
    return clients;
  }

  clean(): void {
    this.values().forEach(client => client.disconnect());
    this.clients.clear();
  }
}
