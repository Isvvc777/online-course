import { describe, it, expect, vi } from 'vitest';
import { executeWithRetry } from '../modules/core.ts';

describe('executeWithRetry', () => {
  it('succeeds on first attempt without delay', async () => {
    const op = vi.fn().mockResolvedValue('ok');
    const result = await executeWithRetry(op);
    expect(result).toBe('ok');
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and recovers', async () => {
    const op = vi.fn()
      .mockRejectedValueOnce(new Error('transient'))
      .mockResolvedValueOnce('recovered');
    const result = await executeWithRetry(op, { initialDelayMs: 10, maxRetries: 2 });
    expect(result).toBe('recovered');
    expect(op).toHaveBeenCalledTimes(2);
  });
});
