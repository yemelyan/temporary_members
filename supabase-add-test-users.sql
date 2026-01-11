-- ============================================
-- Add Fake Pending Users for Testing
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This creates test profiles for testing the approval workflow
-- ============================================

-- Note: If your profiles table has a foreign key constraint to auth.users,
-- you may need to adjust this script. Most Supabase setups have:
-- profiles.id = auth.users.id (UUID)
-- In that case, profiles are typically created automatically when users sign up.
--
-- For testing purposes, if you need to insert test data:
-- Option 1: If user_id/id is nullable in your profiles table, use NULL
-- Option 2: Generate UUIDs that don't reference actual auth users
--           (might fail if FK constraint is strict)
-- Option 3: Temporarily disable FK constraint for testing

-- First, check your profiles table structure:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles';

-- Insert fake pending users
-- Adjust based on your table structure:
INSERT INTO profiles (id, email, display_name, approved, is_admin, created_at, user_id)
VALUES
  (gen_random_uuid(), 'alice.johnson@example.com', 'Alice Johnson', false, false, NOW() - INTERVAL '2 days', gen_random_uuid()),
  (gen_random_uuid(), 'bob.smith@example.com', 'Bob Smith', false, false, NOW() - INTERVAL '5 days', gen_random_uuid()),
  (gen_random_uuid(), 'carol.white@example.com', 'Carol White', false, false, NOW() - INTERVAL '1 day', gen_random_uuid()),
  (gen_random_uuid(), 'david.brown@example.com', 'David Brown', false, false, NOW() - INTERVAL '3 days', gen_random_uuid()),
  (gen_random_uuid(), 'emma.davis@example.com', 'Emma Davis', false, false, NOW() - INTERVAL '6 hours', gen_random_uuid()),
  (gen_random_uuid(), 'frank.miller@example.com', 'Frank Miller', false, false, NOW() - INTERVAL '12 hours', gen_random_uuid()),
  (gen_random_uuid(), 'grace.wilson@example.com', 'Grace Wilson', false, false, NOW() - INTERVAL '4 days', gen_random_uuid()),
  (gen_random_uuid(), 'henry.taylor@example.com', 'Henry Taylor', false, false, NOW() - INTERVAL '1 hour', gen_random_uuid())
ON CONFLICT (id) DO NOTHING;

-- If the above fails with foreign key constraint error, try this version (with NULL user_id):
-- Note: Uncomment the lines below if you need NULL user_id instead

/*
INSERT INTO profiles (id, email, display_name, approved, is_admin, created_at, user_id)
VALUES
  (gen_random_uuid(), 'alice.johnson@example.com', 'Alice Johnson', false, false, NOW() - INTERVAL '2 days', NULL),
  (gen_random_uuid(), 'bob.smith@example.com', 'Bob Smith', false, false, NOW() - INTERVAL '5 days', NULL),
  (gen_random_uuid(), 'carol.white@example.com', 'Carol White', false, false, NOW() - INTERVAL '1 day', NULL),
  (gen_random_uuid(), 'david.brown@example.com', 'David Brown', false, false, NOW() - INTERVAL '3 days', NULL),
  (gen_random_uuid(), 'emma.davis@example.com', 'Emma Davis', false, false, NOW() - INTERVAL '6 hours', NULL),
  (gen_random_uuid(), 'frank.miller@example.com', 'Frank Miller', false, false, NOW() - INTERVAL '12 hours', NULL),
  (gen_random_uuid(), 'grace.wilson@example.com', 'Grace Wilson', false, false, NOW() - INTERVAL '4 days', NULL),
  (gen_random_uuid(), 'henry.taylor@example.com', 'Henry Taylor', false, false, NOW() - INTERVAL '1 hour', NULL)
ON CONFLICT (id) DO NOTHING;
*/

-- Verify the inserted users
SELECT 
  id, 
  email, 
  display_name, 
  approved, 
  is_admin, 
  created_at 
FROM profiles 
WHERE approved = false 
  AND email LIKE '%@example.com'
ORDER BY created_at DESC;

-- To clean up test users later, run:
-- DELETE FROM profiles WHERE email LIKE '%@example.com';
