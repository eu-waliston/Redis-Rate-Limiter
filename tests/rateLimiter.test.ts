import Redis from 'ioredis';
import { checkRateLimit } from '../src/services/rateLimiter.service';
import { redis } from '../src/config/redis';

describe('Rate limiter integration', () => {
  beforeAll(async () => {
    if (redis.status === 'wait') await redis.connect();
    await redis.ping();
  });

  beforeEach(async () => {
    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
  });

  it('allows requests until the limit is reached', async () => {
    const first = await checkRateLimit('test:user', 3, 60);
    const second = await checkRateLimit('test:user', 3, 60);
    const third = await checkRateLimit('test:user', 3, 60);
    const fourth = await checkRateLimit('test:user', 3, 60);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(true);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it('creates a TTL for the window', async () => {
    const result = await checkRateLimit('test:ttl', 10, 60);
    expect(result.resetSeconds).toBeGreaterThan(0);
    expect(result.resetSeconds).toBeLessThanOrEqual(60);
  });

  it('keeps clients isolated by key', async () => {
    const first = await checkRateLimit('test:a', 1, 60);
    const second = await checkRateLimit('test:b', 1, 60);
    const blocked = await checkRateLimit('test:a', 1, 60);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(blocked.allowed).toBe(false);
  });
});
