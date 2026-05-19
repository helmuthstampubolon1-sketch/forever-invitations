
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
ALTER FUNCTION public.guests_restrict_public_update() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
