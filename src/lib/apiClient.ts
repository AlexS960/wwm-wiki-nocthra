import type { User } from '../types/site';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
export const useApiBackend = import.meta.env.VITE_USE_API_BACKEND === 'true';

export function isApiBackendEnabled(): boolean {
  return useApiBackend && Boolean(API_BASE);
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data?: T; error?: string }> {
  if (!API_BASE) return { error: 'VITE_API_URL не задан' };
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
      ...init,
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (body as { error?: string }).error || res.statusText };
    return { data: body as T };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Сеть недоступна' };
  }
}

export type ApiSession = { user: User };
