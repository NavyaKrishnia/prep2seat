
CREATE POLICY "Users can read own preference list"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'preference-lists' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins can manage preference lists"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'preference-lists' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'preference-lists' AND public.has_role(auth.uid(), 'admin'));
