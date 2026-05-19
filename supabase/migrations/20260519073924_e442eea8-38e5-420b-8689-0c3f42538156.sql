
-- ENUMS
CREATE TYPE theme_type AS ENUM ('elegant','floral','modern-dark','javanese');
CREATE TYPE ornament_style AS ENUM ('classic','botanical','geometric','batik');
CREATE TYPE guest_category AS ENUM ('family','friend','colleague','other');
CREATE TYPE rsvp_attendance AS ENUM ('hadir','tidak_hadir','mungkin');
CREATE TYPE rsvp_session AS ENUM ('akad','resepsi','keduanya');
CREATE TYPE gallery_category AS ENUM ('prewedding','couple','venue','other');
CREATE TYPE love_icon AS ENUM ('heart','ring','home','star');

-- Admin roles (separate table - avoid privilege escalation)
CREATE TYPE app_role AS ENUM ('admin','user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- wedding_settings
CREATE TABLE public.wedding_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  groom_name text, groom_full_name text, groom_father text, groom_mother text, groom_photo text,
  bride_name text, bride_full_name text, bride_father text, bride_mother text, bride_photo text,
  akad_datetime timestamptz, akad_venue text, akad_address text, akad_maps_url text, akad_maps_embed text,
  resepsi_datetime timestamptz, resepsi_venue text, resepsi_address text, resepsi_maps_url text, resepsi_maps_embed text,
  theme theme_type NOT NULL DEFAULT 'elegant',
  primary_color varchar(20), secondary_color varchar(20), accent_color varchar(20),
  text_color varchar(20), background_color varchar(20),
  heading_font varchar(100), body_font varchar(100),
  ornament_style ornament_style NOT NULL DEFAULT 'classic',
  music_file varchar(255), music_title varchar(255), music_autoplay boolean NOT NULL DEFAULT true,
  opening_quote text, opening_quote_source text,
  rsvp_open boolean NOT NULL DEFAULT true, rsvp_deadline date,
  og_image varchar(255), meta_description varchar(500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_ws_updated BEFORE UPDATE ON public.wedding_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
ALTER TABLE public.wedding_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws public read" ON public.wedding_settings FOR SELECT USING (true);
CREATE POLICY "ws admin write" ON public.wedding_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- guests
CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, slug text NOT NULL UNIQUE,
  phone text, email text,
  category guest_category NOT NULL DEFAULT 'friend',
  notes text, is_active boolean NOT NULL DEFAULT true,
  opened_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_g_updated BEFORE UPDATE ON public.guests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
-- public can read minimal info via slug (needed by /untuk/:slug page). Restrict columns at app layer; keep simple here.
CREATE POLICY "guests public read by slug" ON public.guests FOR SELECT USING (is_active = true);
CREATE POLICY "guests admin write" ON public.guests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
-- Allow anyone to update opened_at (set timestamp on first view). Restrict to that column via trigger.
CREATE OR REPLACE FUNCTION public.guests_restrict_public_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(),'admin') THEN
    -- non-admin: only opened_at + updated_at may change
    IF NEW.name <> OLD.name OR NEW.slug <> OLD.slug OR NEW.phone IS DISTINCT FROM OLD.phone
       OR NEW.email IS DISTINCT FROM OLD.email OR NEW.category <> OLD.category
       OR NEW.notes IS DISTINCT FROM OLD.notes OR NEW.is_active <> OLD.is_active THEN
      RAISE EXCEPTION 'Not allowed';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_g_restrict BEFORE UPDATE ON public.guests FOR EACH ROW EXECUTE FUNCTION public.guests_restrict_public_update();
CREATE POLICY "guests public update opened" ON public.guests FOR UPDATE USING (is_active = true) WITH CHECK (is_active = true);

-- rsvps
CREATE TABLE public.rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid REFERENCES public.guests(id) ON DELETE SET NULL,
  name text NOT NULL, phone text,
  attendance rsvp_attendance NOT NULL DEFAULT 'hadir',
  session rsvp_session NOT NULL DEFAULT 'keduanya',
  total_guests int NOT NULL DEFAULT 1,
  message text, ip_address varchar(64),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rsvp public insert" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "rsvp admin read" ON public.rsvps FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "rsvp admin manage" ON public.rsvps FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- guestbook_messages
CREATE TABLE public.guestbook_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid REFERENCES public.guests(id) ON DELETE SET NULL,
  name text NOT NULL, location varchar(255),
  message text NOT NULL,
  is_approved boolean NOT NULL DEFAULT true,
  ip_address varchar(64),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.guestbook_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gb public insert" ON public.guestbook_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "gb public read approved" ON public.guestbook_messages FOR SELECT USING (is_approved = true);
CREATE POLICY "gb admin all" ON public.guestbook_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- gallery_photos
CREATE TABLE public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path text NOT NULL, caption text,
  category gallery_category NOT NULL DEFAULT 'couple',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gp public read" ON public.gallery_photos FOR SELECT USING (is_active = true);
CREATE POLICY "gp admin write" ON public.gallery_photos FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- love_story_items
CREATE TABLE public.love_story_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, content text NOT NULL,
  event_date date, photo varchar(255), location varchar(255),
  icon love_icon NOT NULL DEFAULT 'heart',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.love_story_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ls public read" ON public.love_story_items FOR SELECT USING (is_active = true);
CREATE POLICY "ls admin write" ON public.love_story_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- bank_accounts
CREATE TABLE public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL, account_number text NOT NULL, account_name text NOT NULL,
  bank_logo varchar(255), qris_image varchar(255),
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ba public read" ON public.bank_accounts FOR SELECT USING (is_active = true);
CREATE POLICY "ba admin write" ON public.bank_accounts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- SEED
INSERT INTO public.wedding_settings (
  groom_name, bride_name,
  akad_datetime, resepsi_datetime,
  theme, primary_color, secondary_color, accent_color, text_color, background_color,
  heading_font, body_font
) VALUES (
  'Raka', 'Dinda',
  (now() + interval '3 months')::date + time '08:00',
  (now() + interval '3 months')::date + time '11:00',
  'elegant', '#C9A96E', '#F5F0E8', '#8B6914', '#2C2C2C', '#FFFFFF',
  'Cormorant Garamond', 'Lato'
);

INSERT INTO public.guests (name, slug, category) VALUES
  ('Budi Santoso','budi-santoso','friend'),
  ('Siti Rahma','siti-rahma','family');

INSERT INTO public.love_story_items (title, content, event_date, icon, display_order) VALUES
  ('First Meet','Kami bertemu pertama kali di kampus.', '2020-08-15', 'heart', 1),
  ('Engagement','Lamaran resmi di rumah keluarga Dinda.', '2025-12-10', 'ring', 2);

INSERT INTO public.bank_accounts (bank_name, account_number, account_name, display_order) VALUES
  ('BCA','1234567890','Dinda Pratiwi',1);
