-- Внутренний путь: кастомные русские статьи (не перезаписываются сидами).
update public.wiki_articles
set
  fields = jsonb_set(coalesce(fields, '{}'::jsonb), '{source}', '"custom"'::jsonb, true),
  updated_at = now()
where section = 'innerpath';

update public.wiki_articles
set fields = fields - 'nameEn' - 'name_en',
    updated_at = now()
where fields ? 'nameEn' or fields ? 'name_en';
