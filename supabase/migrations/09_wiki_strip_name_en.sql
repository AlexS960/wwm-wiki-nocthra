-- Удаляет английские подписи nameEn из wiki_articles (русский текст в title/content).
-- Кастомные статьи редакторов не трогаем.
update public.wiki_articles
set
  fields = fields - 'nameEn',
  updated_at = now()
where fields ? 'nameEn'
  and coalesce(fields->>'source', 'seed') <> 'custom';
