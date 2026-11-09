import { describe, it, expect } from 'vitest';
import { verifyAuthorizationHeader } from '../modules/core.ts';

describe('verifyAuthorizationHeader', () => {
  it('extracts bearer token cleanly', () => {
    const res = verifyAuthorizationHeader('Bearer test-token-123');
    expect(res.valid).toBe(true);
    expect(res.token).toBe('test-token-123');
  });

  it('rejects invalid schemes', () => {
    const res = verifyAuthorizationHeader('Basic 12345');
    expect(res.valid).toBe(false);
  });
});
