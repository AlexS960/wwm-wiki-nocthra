/** Временные логи отладки сессии 63ff1c — удалить после верификации. */
export function dbgLog(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string,
): void {
  // #region agent log
  fetch('http://127.0.0.1:7273/ingest/b261aa8d-26c3-4c72-8143-326f8702d3ff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '63ff1c' },
    body: JSON.stringify({
      sessionId: '63ff1c',
      location,
      message,
      data,
      hypothesisId,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}
