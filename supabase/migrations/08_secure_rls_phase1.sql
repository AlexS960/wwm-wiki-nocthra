-- Фаза 1: подготовка к закрытию RLS (НЕ ломает текущий клиент с anon-ключом).
-- Полное закрытие возможно только после перехода на API-бэкенд (server/).
-- Выполнить в Supabase SQL Editor после бэкапа.

-- 1. Публичное представление аккаунтов без password_hash
create or replace view public.accounts_public as
select
  id,
  username,
  role,
  picture,
  game_nickname,
  guild_id,
  created_at,
  last_seen
from public.accounts;

grant select on public.accounts_public to anon, authenticated;

comment on view public.accounts_public is
  'Безопасный список аккаунтов для клиента. password_hash только через API /login.';

-- 2. Запрет прямого SELECT password_hash для anon (опционально, после миграции клиента на view)
-- revoke select on public.accounts from anon;
-- grant select on public.accounts_public to anon;

-- 3. user_progress: только владелец (после JWT в Supabase Auth или API)
-- Пока закомментировано — требует service role / Edge Functions:
/*
drop policy if exists "anon_all_user_progress" on public.user_progress;
create policy "user_progress_select_own" on public.user_progress
  for select to authenticated using (auth.uid()::text = user_id);
create policy "user_progress_upsert_own" on public.user_progress
  for all to authenticated using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
*/

-- 4. accounts: запрет смены role через anon (после API)
/*
drop policy if exists "anon_all_accounts" on public.accounts;
create policy "accounts_read_public" on public.accounts
  for select to anon using (true);
create policy "accounts_insert_register" on public.accounts
  for insert to anon with check (role = 'user');
*/
