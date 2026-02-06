-- Script to upgrade an existing user to Master role
-- Replace 'your-email@example.com' with the actual email address

-- First, sign up normally through /auth/sign-up with your email and password
-- Then run this script to upgrade that user to Master role

UPDATE public.profiles
SET role = 'master'
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, full_name, role, balance 
FROM public.profiles 
WHERE role = 'master';
