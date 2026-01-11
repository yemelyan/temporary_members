-- ============================================
-- Supabase Content, Likes, and Comments Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Create content table if it doesn't exist
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, user_id) -- Prevent duplicate likes
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content table
-- Allow all authenticated users to read content
CREATE POLICY "Anyone can view content"
ON content
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for likes table
-- Allow authenticated users to like/unlike content
CREATE POLICY "Users can like content"
ON likes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
ON likes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow anyone to view likes count
CREATE POLICY "Anyone can view likes"
ON likes
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for comments table
-- Allow authenticated users to read comments
CREATE POLICY "Anyone can view comments"
ON comments
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to create comments
CREATE POLICY "Users can create comments"
ON comments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own comments (optional, for future use)
CREATE POLICY "Users can update their own comments"
ON comments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own comments (optional, for future use)
CREATE POLICY "Users can delete their own comments"
ON comments
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_likes_content_id ON likes(content_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_content_id ON comments(content_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- Create a function to get comment with user display_name
-- This is handled in the application, but can be useful for direct queries
-- The app joins profiles table when fetching comments
