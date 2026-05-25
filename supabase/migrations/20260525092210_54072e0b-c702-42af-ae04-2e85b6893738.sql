
DROP POLICY IF EXISTS "guests public read by slug" ON public.guests;
DROP POLICY IF EXISTS "guests public update opened" ON public.guests;

DROP FUNCTION IF EXISTS public.guests_restrict_public_update() CASCADE;

CREATE OR REPLACE FUNCTION public.get_guest_by_slug(_slug text)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  category guest_category,
  opened_at timestamptz,
  is_active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.guests
     SET opened_at = COALESCE(opened_at, now())
   WHERE guests.slug = _slug AND guests.is_active = true;

  RETURN QUERY
    SELECT g.id, g.name, g.slug, g.category, g.opened_at, g.is_active
      FROM public.guests g
     WHERE g.slug = _slug AND g.is_active = true;
END $$;

REVOKE ALL ON FUNCTION public.get_guest_by_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_guest_by_slug(text) TO anon, authenticated;

DROP POLICY IF EXISTS "rsvp public insert" ON public.rsvps;
CREATE POLICY "rsvp public insert"
  ON public.rsvps
  FOR INSERT
  TO public
  WITH CHECK (
    total_guests BETWEEN 1 AND 20
    AND ip_address IS NULL
    AND length(name) BETWEEN 1 AND 100
    AND (phone IS NULL OR length(phone) <= 30)
    AND (message IS NULL OR length(message) <= 1000)
  );

DROP POLICY IF EXISTS "gb public insert" ON public.guestbook_messages;
CREATE POLICY "gb public insert"
  ON public.guestbook_messages
  FOR INSERT
  TO public
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(message) BETWEEN 1 AND 1000
    AND (location IS NULL OR length(location) <= 100)
    AND ip_address IS NULL
    AND is_approved = true
  );
