-- Allow the specific Admin email to update ANY profile (for banning/timeouts)
-- This is required because the default RLS only allows users to update their OWN profile.

DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'email') = 'rtme52@gmail.com'
)
WITH CHECK (
  (auth.jwt() ->> 'email') = 'rtme52@gmail.com'
);
