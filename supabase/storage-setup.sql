-- Supabase Storage для скриншотов (выполнить в SQL Editor после setup.sql)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152;

DROP POLICY IF EXISTS "site_images_public_read" ON storage.objects;
CREATE POLICY "site_images_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "site_images_anon_insert" ON storage.objects;
CREATE POLICY "site_images_anon_insert" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'site-images');

DROP POLICY IF EXISTS "site_images_anon_update" ON storage.objects;
CREATE POLICY "site_images_anon_update" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "site_images_anon_delete" ON storage.objects;
CREATE POLICY "site_images_anon_delete" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'site-images');
