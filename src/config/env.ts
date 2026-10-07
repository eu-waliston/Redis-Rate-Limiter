import 'dotenv/config';

function numberEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${name} must be a number`);
  return parsed;
}

export const env = {
  port: numberEnv('PORT', 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  trustProxy: process.env.TRUST_PROXY === 'true',
  redisHost: process.env.REDIS_HOST ?? 'localhost',
  redisPort: numberEnv('REDIS_PORT', 6379),
  redisPassword: process.env.REDIS_PASSWORD || undefined,
  rateLimitMaxRequests: numberEnv('RATE_LIMIT_MAX_REQUESTS', 10),
  rateLimitWindowSeconds: numberEnv('RATE_LIMIT_WINDOW_SECONDS', 60)
};
