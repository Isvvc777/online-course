/**
 * DEVFORGE Rate Limiter Module
 * Implements sliding window memory algorithm for API rate protection.
 */

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterMs?: number;
}

export class SlidingWindowRateLimiter {
  private requests = new Map<string, number[]>();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.windowMs = config.windowMs ?? 60_000;
    this.maxRequests = config.maxRequests ?? 100;
  }

  public check(key: string): RateLimitResult {
    const now = Date.now();
    const timestamps = (this.requests.get(key) || []).filter(
      (ts) => now - ts < this.windowMs
    );

    if (timestamps.length >= this.maxRequests) {
      const oldest = timestamps[0];
      const retryAfterMs = Math.max(0, this.windowMs - (now - oldest));
      return {
        allowed: false,
        limit: this.maxRequests,
        remaining: 0,
        retryAfterMs,
      };
    }

    timestamps.push(now);
    this.requests.set(key, timestamps);

    return {
      allowed: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - timestamps.length,
    };
  }

  public reset(key?: string): void {
    if (key) {
      this.requests.delete(key);
    } else {
      this.requests.clear();
    }
  }
}
