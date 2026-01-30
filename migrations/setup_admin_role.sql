-- 1. Add is_admin column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Grant Admin status to YOU (The first admin)
-- Replace "rtme52@gmail.com" with the email associated with your user
-- We update based on the auth.users table match, but since we can't join easily in simple update for profiles which might lack email,
-- we rely on you knowing your ID or just manually updating via Supabase Dashboard.
-- BUT, for this script, we can try to update if we assume profiles has no email column (it doesn't).
-- SO: You will need to manually check the "is_admin" box for your user in Supabase Table Editor.
-- OR: If you are logged in, we can try to guess, but manual is safer.

-- 3. Create Scalable RLS Policies using is_admin column

-- A. Allow Admins to Update/Delete ANY Listing
DROP POLICY IF EXISTS "Admins can update listings" ON listings;
CREATE POLICY "Admins can update listings"
ON listings FOR UPDATE
TO authenticated
USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
);

DROP POLICY IF EXISTS "Admins can delete listings" ON listings;
CREATE POLICY "Admins can delete listings"
ON listings FOR DELETE
TO authenticated
USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
);

-- B. Allow Admins to Update ANY Profile (for banning)
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
);

-- INSTRUCTION:
-- 1. Run this script.
-- 2. Go to 'profiles' table in Table Editor.
-- 3. Find your row and check the 'is_admin' box (set to TRUE).
-- 4. Now you are a permanent admin, and can add others just by checking their box too.
