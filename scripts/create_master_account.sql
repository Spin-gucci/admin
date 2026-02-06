-- Script untuk membuat akun Master langsung di Supabase
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- PENTING: Ganti email dan password di bawah ini sesuai keinginan Anda
-- Password akan di-hash otomatis oleh Supabase

DO $$
DECLARE
  new_user_id uuid;
  hashed_password text;
BEGIN
  -- Generate UUID untuk user baru
  new_user_id := gen_random_uuid();
  
  -- Hash password menggunakan bcrypt (Supabase akan handle ini)
  -- Password default: master123
  -- GANTI 'master123' dengan password pilihan Anda
  hashed_password := crypt('master123', gen_salt('bf'));
  
  -- 1. Insert ke auth.users (tabel internal Supabase Auth)
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    aud,
    role,
    confirmation_token,
    email_change_token_new,
    recovery_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'master@admin.com', -- GANTI dengan email pilihan Anda
    hashed_password,
    NOW(), -- Email langsung confirmed
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    '',
    '',
    ''
  );
  
  -- 2. Insert ke public.profiles dengan role master
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'master@admin.com', -- GANTI dengan email yang sama
    'Master Admin', -- GANTI dengan nama pilihan Anda
    'master',
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'Akun master berhasil dibuat!';
  RAISE NOTICE 'Email: master@admin.com';
  RAISE NOTICE 'Password: master123';
  RAISE NOTICE 'Silakan login menggunakan kredensial di atas.';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error: %', SQLERRM;
END $$;
