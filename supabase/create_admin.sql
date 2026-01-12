-- Script to create an admin user for testing
-- Run this after creating a user through Supabase Auth UI or API
-- Replace 'USER_EMAIL_HERE' with the actual email of the user you want to make admin

-- Example: Update user role to admin
-- UPDATE public.users
-- SET role = 'admin'
-- WHERE email = 'admin@example.com';

-- Or if you know the user ID:
-- UPDATE public.users
-- SET role = 'admin'
-- WHERE id = 'USER_UUID_HERE';

-- To create a test admin account:
-- 1. First, register a user through the app or Supabase Auth UI
-- 2. Then run this SQL in Supabase SQL Editor:
--    UPDATE public.users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
