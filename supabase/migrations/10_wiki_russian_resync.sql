-- Очистка английских подписей nameEn из дефолтных статей вики.
-- Полная перезапись русским контентом: npm run wiki:push-db

update public.wiki_articles
set
  fields = fields - 'nameEn',
  updated_at = now()
where fields ? 'nameEn'
  and coalesce(fields->>'source', 'seed') <> 'custom';
