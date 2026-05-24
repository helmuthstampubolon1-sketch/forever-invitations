INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-assets', 'wedding-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "wedding-assets public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'wedding-assets');

CREATE POLICY "wedding-assets admin insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'wedding-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "wedding-assets admin update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'wedding-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "wedding-assets admin delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'wedding-assets' AND public.has_role(auth.uid(), 'admin'));