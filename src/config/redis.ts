import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis({
  host: env.redisHost,
  port: env.redisPort,
  password: env.redisPassword,
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableReadyCheck: true
});

redis.on('error', (error) => {
  console.error('[Redis] error:', error.message);
});

export async function connectRedis(): Promise<void> {
  if (redis.status === 'wait') await redis.connect();
  await redis.ping();
}

export async function disconnectRedis(): Promise<void> {
  if (redis.status !== 'end') await redis.quit();
}
