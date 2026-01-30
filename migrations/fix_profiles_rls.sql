-- 1. Enable RLS on profiles (ensure it is on)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Allow everyone to view profiles (needed for Admin List and general site usage)
-- Drop existing potential conflict first (optional, but safe)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- 3. Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. EMERGENCY ADMIN FIX: Allow updates for specific Admin Emails?
-- Since we don't have Service Role, we need a way for YOU to ban people.
-- We can add a policy that checks the email of the user executing the command.
-- Replace 'admin@example.com' with your actual admin email from admin-config.ts
-- However, SQL doesn't easily access the config file.

-- Better approach for now:
-- Just ensure you can READ the users.
-- We will rely on you adding a SERVICE_ROLE_KEY for the banning to work 100% securely without loose RLS.
