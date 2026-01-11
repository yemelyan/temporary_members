-- ============================================
-- Supabase Admin Setup & RLS Policies
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Step 1: Add is_admin column to profiles table if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false NOT NULL;

-- Step 2: Add approved column to profiles table if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false NOT NULL;

-- Step 3: Create RLS policy for admins to update any profile's approved status
-- This allows users with is_admin=true to update the approved field of any profile
CREATE POLICY "Admins can update profile approval status"
ON profiles
FOR UPDATE
TO authenticated
USING (
  -- Check if the current user is an admin
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  )
)
WITH CHECK (
  -- Ensure the updating user is an admin
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  )
);

-- Step 4: Make your user an admin (replace with your email)
-- Update the profiles table to set is_admin = true for your user
UPDATE profiles
SET is_admin = true
WHERE email = 'jazepsbikse@gmail.com';

-- Optional: Also approve your user if not already approved
UPDATE profiles
SET approved = true
WHERE email = 'jazepsbikse@gmail.com';

-- ============================================
-- Verification Queries (optional - run to verify)
-- ============================================

-- Check if your user is now an admin
-- SELECT id, email, display_name, is_admin, approved
-- FROM profiles
-- WHERE email = 'jazepsbikse@gmail.com';

-- Check all pending users
-- SELECT id, email, display_name, created_at, approved
-- FROM profiles
-- WHERE approved = false
-- ORDER BY created_at;
