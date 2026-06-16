-- Подготовка к закрытию RLS (НЕ ломает текущий клиент с anon-ключом).
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
revoke insert, update, delete on public.accounts_public from anon, authenticated;

comment on view public.accounts_public is
  'Безопасный список аккаунтов для клиента без password_hash.';

-- 2. После применения миграции клиент читает списки через accounts_public (dbListAccounts).
-- Логин по-прежнему использует таблицу accounts (нужен password_hash) — закрыть отдельно позже.

-- 3. Опционально: отозвать прямой SELECT у anon на таблице (только после проверки логина/регистрации):
-- revoke select on public.accounts from anon;
-- grant select on public.accounts_public to anon;

-- 4. user_progress: только владелец (после настройки auth.uid())
-- Пока закомментировано — требует service role / Edge Functions:
/*
drop policy if exists "anon_all_user_progress" on public.user_progress;
create policy "user_progress_select_own" on public.user_progress
  for select to authenticated using (auth.uid()::text = user_id);
create policy "user_progress_upsert_own" on public.user_progress
  for all to authenticated using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
*/

-- 5. accounts: запрет смены role через anon (раскомментировать, когда клиент готов)
/*
drop policy if exists "anon_all_accounts" on public.accounts;
create policy "accounts_read_public" on public.accounts
  for select to anon using (true);
create policy "accounts_insert_register" on public.accounts
  for insert to anon with check (role = 'user');
create policy "accounts_update_own_profile" on public.accounts
  for update to anon using (true) with check (role = (select role from public.accounts a where a.id = accounts.id));
*/
