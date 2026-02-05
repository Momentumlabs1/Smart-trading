-- Enable RLS on courses table (was missing)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop and recreate the policy to ensure it's properly applied
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
CREATE POLICY "Anyone can view published courses" ON courses FOR SELECT USING (is_published = true);