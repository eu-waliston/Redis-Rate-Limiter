import type { RequestHandler } from 'express';
import { env } from '../config/env';
import { checkRateLimit } from '../services/rateLimiter.service';
import type { RateLimitOptions } from '../types/rateLimiter';

const defaultKeyGenerator = (req: Parameters<RequestHandler>[0]): string => {
  return req.ip || req.socket.remoteAddress || 'unknown';
};

export function rateLimiter(options: RateLimitOptions): RequestHandler {
  const keyPrefix = options.keyPrefix ?? 'rate-limit';
  const keyGenerator = options.keyGenerator ?? defaultKeyGenerator;

  if (options.limit <= 0 || options.windowSeconds <= 0) {
    throw new Error('Rate limiter limit and window must be greater than zero');
  }

  return async (req, res, next) => {
    try {
      const identifier = keyGenerator(req);
      const key = `${keyPrefix}:${identifier}`;
      const result = await checkRateLimit(key, options.limit, options.windowSeconds);

      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.resetSeconds);

      if (!result.allowed) {
        res.setHeader('Retry-After', result.retryAfter);
        return res.status(429).json({
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Try again later.',
          retryAfter: result.retryAfter
        });
      }

      next();
    } catch (error) {
      console.error('[RateLimiter] failed:', error);
      // Fail open: an outage in Redis should not take the entire API down.
      // For security-sensitive endpoints, consider a configurable fail-closed mode.
      res.setHeader('X-RateLimit-Error', 'redis-unavailable');
      next();
    }
  };
}

export const defaultRateLimiter = rateLimiter({
  limit: env.rateLimitMaxRequests,
  windowSeconds: env.rateLimitWindowSeconds
});
