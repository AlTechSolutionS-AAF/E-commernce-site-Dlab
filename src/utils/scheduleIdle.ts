/**
 * Runs `callback` when the browser is idle (or after `timeout` ms at the latest),
 * keeping non-urgent work such as cache serialization or chunk prefetching off
 * the critical render path. Returns a cancel function, suitable for returning
 * directly from a `useEffect` cleanup.
 */
export function scheduleIdle(callback: () => void, timeout = 1000): () => void {
  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(() => callback(), { timeout });
    return () => window.cancelIdleCallback(id);
  }
  // Safari < 16.4 and non-browser environments: fall back to a short timeout.
  const id = setTimeout(callback, Math.min(timeout, 200));
  return () => clearTimeout(id);
}
