import type { RequestHandler } from 'express';

export interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
  keyPrefix?: string;
  keyGenerator?: (req: Parameters<RequestHandler>[0]) => string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  retryAfter: number;
}
