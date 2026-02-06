-- Script untuk membuat akun master default
-- Email: master@admin.com
-- Password: Master123!

-- Catatan: User harus didaftarkan melalui Supabase Auth terlebih dahulu
-- Script ini hanya membuat profile dengan role master

-- Hapus profile lama jika ada (opsional)
-- DELETE FROM profiles WHERE email = 'master@admin.com';

-- Insert profile master
-- Ganti 'YOUR_USER_ID_HERE' dengan user_id dari Supabase Auth setelah registrasi
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_ID_HERE', -- ID akan diisi otomatis dari auth.users
  'master@admin.com',
  'Master Admin',
  'master',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE 
SET 
  role = 'master',
  full_name = 'Master Admin',
  updated_at = NOW();

-- Berikan akses penuh ke semua fitur
-- Profile dengan role master akan memiliki akses ke semua halaman
