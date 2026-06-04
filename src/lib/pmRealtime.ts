import { getSupabase } from './supabase';

/** Realtime по таблице pm_messages (не site_data) */
export function subscribePmMessages(onChange: () => void): () => void {
  const channel = getSupabase()
    .channel('pm_messages-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'pm_messages' },
      () => onChange(),
    )
    .subscribe();

  return () => {
    getSupabase().removeChannel(channel);
  };
}
