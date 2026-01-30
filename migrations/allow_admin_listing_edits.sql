-- Allow the specific Admin email to update/delete ANY listing
-- This ensures the "Hide" and "Delete" buttons in the Admin Panel work for all user posts.

-- 1. Allow UPDATE (for hiding listings)
DROP POLICY IF EXISTS "Admins can update any listing" ON listings;

CREATE POLICY "Admins can update any listing"
ON listings FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'email') = 'rtme52@gmail.com'
)
WITH CHECK (
  (auth.jwt() ->> 'email') = 'rtme52@gmail.com'
);

-- 2. Allow DELETE (for deleting listings)
DROP POLICY IF EXISTS "Admins can delete any listing" ON listings;

CREATE POLICY "Admins can delete any listing"
ON listings FOR DELETE
TO authenticated
USING (
  (auth.jwt() ->> 'email') = 'rtme52@gmail.com'
);
