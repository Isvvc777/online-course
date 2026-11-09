/**
 * DEVFORGE Exponential Backoff & Retry Mechanism
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  factor?: number;
}

export async function executeWithRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const initialDelay = options.initialDelayMs ?? 200;
  const maxDelay = options.maxDelayMs ?? 3000;
  const factor = options.factor ?? 2;

  let attempt = 0;
  while (true) {
    try {
      return await operation(attempt);
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) throw err;
      const jitter = Math.random() * 0.3 + 0.85;
      const delay = Math.min(maxDelay, initialDelay * Math.pow(factor, attempt - 1) * jitter);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
