import { getSupabase } from './supabase';

const cache = new Map<string, boolean>();

function isMissingTableError(message: string): boolean {
  const msg = message.toLowerCase();
  return msg.includes('does not exist') || msg.includes('could not find');
}

/** Проверяет, доступна ли нормализованная таблица в Supabase (с кэшем). */
export async function isTableReady(table: string): Promise<boolean> {
  if (cache.has(table)) return cache.get(table)!;

  const { error } = await getSupabase().from(table).select('id').limit(1);
  const ready = !error || !isMissingTableError(error.message);
  cache.set(table, ready);
  return ready;
}

export function resetTableReadyCache(): void {
  cache.clear();
}
