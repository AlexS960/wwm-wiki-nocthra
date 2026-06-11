-- Полнотекстовый поиск и индексы для пагинации

-- Гайды: search_vector
alter table public.guides add column if not exists search_vector tsvector;

update public.guides
set search_vector = to_tsvector(
  'russian',
  coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(content, '') || ' ' || coalesce(category, '')
)
where search_vector is null;

create index if not exists idx_guides_search on public.guides using gin(search_vector);
create index if not exists idx_guides_created_desc on public.guides(created_at desc);

create or replace function public.guides_search_vector_update()
returns trigger
language plpgsql
as $$
begin
  new.search_vector := to_tsvector(
    'russian',
    coalesce(new.title, '') || ' ' || coalesce(new.summary, '') || ' ' || coalesce(new.content, '') || ' ' || coalesce(new.category, '')
  );
  return new;
end;
$$;

drop trigger if exists guides_search_vector_trigger on public.guides;
create trigger guides_search_vector_trigger
  before insert or update of title, summary, content, category on public.guides
  for each row execute function public.guides_search_vector_update();

-- Чат: search_vector
alter table public.chat_messages add column if not exists search_vector tsvector;

update public.chat_messages
set search_vector = to_tsvector('russian', coalesce(message, ''))
where search_vector is null;

create index if not exists idx_chat_messages_search on public.chat_messages using gin(search_vector);
create index if not exists idx_chat_messages_created_desc on public.chat_messages(created_at desc);

create or replace function public.chat_messages_search_vector_update()
returns trigger
language plpgsql
as $$
begin
  new.search_vector := to_tsvector('russian', coalesce(new.message, ''));
  return new;
end;
$$;

drop trigger if exists chat_messages_search_vector_trigger on public.chat_messages;
create trigger chat_messages_search_vector_trigger
  before insert or update of message on public.chat_messages
  for each row execute function public.chat_messages_search_vector_update();
