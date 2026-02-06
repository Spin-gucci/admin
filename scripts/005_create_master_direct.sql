-- ====================================
-- CARA TERCEPAT: Buat Master User Langsung
-- ====================================
-- Copy script ini ke Supabase SQL Editor dan jalankan
-- Ganti email dan password sesuai keinginan Anda

-- STEP 1: Insert user ke auth.users (dengan password ter-hash)
-- Password di bawah ini adalah: Master123456
-- Jika ingin password lain, gunakan cara di STEP 2

-- Cara paling simple: Buat akun biasa dulu, lalu upgrade ke Master
-- Tidak perlu insert ke auth.users secara manual

-- STEP 1: Buat akun di /auth/sign-up dengan:
--   Email: master@demo.com
--   Password: Master123456
--   Full Name: Master Admin

-- STEP 2: Setelah sign up, jalankan query ini untuk upgrade ke Master:

UPDATE public.profiles 
SET role = 'master' 
WHERE email = 'master@demo.com'; -- GANTI dengan email yang tadi didaftarkan

-- ====================================
-- SETELAH MENJALANKAN SCRIPT:
-- ====================================
-- 1. Buka /auth/login
-- 2. Login dengan:
--    Email: master@demo.com
--    Password: Master123456
-- 3. Selesai! Anda sekarang Master
