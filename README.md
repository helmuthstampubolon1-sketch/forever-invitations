# Wedding Invitation App

React + TanStack Start + Supabase. Tema-able, mobile-first, admin panel lengkap.

## Routes utama
- `/` — landing
- `/untuk/:slug` — undangan personal per tamu
- `/admin/login` — login admin
- `/admin/dashboard`, `/admin/guests`, `/admin/rsvp`, `/admin/guestbook`, `/admin/settings`

## Admin Login

Buat user admin lewat Lovable Cloud → Backend → Auth → Add User (email + password).
Lalu insert role:
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'admin@kamu.com';
```

## Deployment ke Hostinger

App ini React SPA + Supabase. Tidak butuh server backend sendiri — bisa deploy sebagai static site.

### Build
```bash
npm run build
# output: /dist
```

### Deploy via Hostinger File Manager
1. Login Hostinger → Hosting → File Manager
2. Masuk folder `public_html`
3. Upload semua isi folder `/dist`
4. Buat file `.htaccess` di `public_html`:
   ```
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QSA,L]
   ```
   (penting biar route `/untuk/:slug` dan `/admin/*` bisa diakses langsung)

### Environment Variables
Buat file `.env.production`:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### Supabase / Lovable Cloud Setup
1. Migration SQL sudah otomatis dijalankan via Lovable Cloud
2. Storage bucket `wedding-assets` sudah dibuat (public)
3. Buat admin user + assign role `admin` (lihat di atas)

### Custom Domain
Hostinger → Domains → Add domain → arahkan A record. Tidak perlu ubah Supabase URL.
