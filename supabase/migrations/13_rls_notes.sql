-- RLS: документация и подготовка (без поломки anon-клиента).
--
-- Сайт использует кастомные accounts + anon-ключ Supabase, без Supabase Auth.
-- Строгая построчная безопасность (auth.uid()) требует Edge Functions / service role.
-- См. также migrations/08_secure_rls_phase1.sql (accounts_public).

comment on policy "anon_all_chat_messages" on public.chat_messages is
  'Временно: полный доступ anon. Права удаления проверяются в приложении (chat.delete).';

comment on policy "anon_all_pm_messages" on public.pm_messages is
  'Временно: полный доступ anon. Удаление «у всех» — только отправитель, в коде.';

comment on policy "anon_all_staff_group_messages" on public.staff_group_messages is
  'Временно: полный доступ anon. Доступ к служебному чату — staff.chat в приложении.';

comment on policy "anon_all_support_tickets" on public.support_tickets is
  'Временно: полный доступ anon. Удаление — support.delete в приложении.';

-- Публичное чтение аккаунтов без password_hash (если view ещё не создан — см. 08):
do $$
begin
  if not exists (
    select 1 from information_schema.views
    where table_schema = 'public' and table_name = 'accounts_public'
  ) then
    create view public.accounts_public as
    select id, username, role, picture, game_nickname, guild_id, created_at, last_seen
    from public.accounts;
    grant select on public.accounts_public to anon, authenticated;
  end if;
end $$;
