import { redis } from '../config/redis';
import type { RateLimitResult } from '../types/rateLimiter';

const FIXED_WINDOW_SCRIPT = `
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
local ttl = redis.call('TTL', KEYS[1])
return { current, ttl }
`;

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const result = (await redis.eval(
    FIXED_WINDOW_SCRIPT,
    1,
    key,
    windowSeconds
  )) as [number, number];

  const current = Number(result[0]);
  const ttl = Math.max(Number(result[1]), 0);
  const allowed = current <= limit;
  const remaining = Math.max(limit - current, 0);

  return {
    allowed,
    limit,
    remaining,
    resetSeconds: ttl,
    retryAfter: allowed ? 0 : ttl
  };
}
