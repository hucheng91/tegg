import RedisServer from 'redis-server';

export async function startRedisServer(port = 6379): Promise<RedisServer> {
  const server = new RedisServer(port);
  await server.open();
  console.log(`Redis server start at ${port}.`);
  return server;
}

export { RedisServer };
