// Wraps a promise so it can never hang forever. If a Supabase call stalls
// (flaky connection, slow network) this rejects after `ms` instead of
// leaving a "Saving…" button stuck indefinitely — the caller's catch
// block then queues the data locally and shows a retry banner, exactly
// like any other failed save (security.md — every failure state must be
// visible and recoverable, never a silent dead end).
export function withTimeout(promise, ms = 12000, message = 'Request timed out') {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ]);
}
