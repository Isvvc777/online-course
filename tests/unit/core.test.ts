import { describe, it, expect, beforeEach } from 'vitest';
import { SlidingWindowRateLimiter } from '../modules/core.ts';

describe('SlidingWindowRateLimiter', () => {
  let limiter: SlidingWindowRateLimiter;

  beforeEach(() => {
    limiter = new SlidingWindowRateLimiter({ windowMs: 1000, maxRequests: 3 });
  });

  it('allows requests within threshold', () => {
    const r1 = limiter.check('user-1');
    const r2 = limiter.check('user-1');
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);
  });

  it('blocks requests exceeding limit with retryAfter calculation', () => {
    limiter.check('user-1');
    limiter.check('user-1');
    limiter.check('user-1');
    const blocked = limiter.check('user-1');
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });
});
