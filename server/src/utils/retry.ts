interface RetryOptions {
  attempts?: number;
  delayMs?: number;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { attempts = 2, delayMs = 1000 } = options;
  let lastError: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const response = (err as { response?: { status?: number } }).response;
      const status = response?.status;
      if (status !== undefined && status < 500 && status !== 429) {
        throw err;
      }
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}
