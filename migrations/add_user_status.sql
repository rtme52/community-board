-- Add status columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS banned_until TIMESTAMPTZ;

-- Enable admin to update these columns
-- (RLS Policy update would technically be needed if we locked down profiles strictly,
-- but typically update policies are simple or admin-actions bypass RLS in some setups.
-- Since we use server actions with getUser(), we rely on application-level checks for now
-- or existing admin RLS if present).

-- Note: Ensure you run this in Supabase SQL Editor.
