-- Add is_admin_hidden column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS is_admin_hidden BOOLEAN DEFAULT FALSE;

-- Ensure logic in applications respects this.
-- If is_admin_hidden is TRUE, the listing should act as hidden regardless of is_hidden status.
