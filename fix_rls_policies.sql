-- ========================================
-- FIX RLS POLICIES - NO INFINITE RECURSION
-- ========================================
-- This script fixes the infinite recursion issue in the RLS policies

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Step 2: Create a simple, non-recursive admin check function
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user has admin role in their profile
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create simplified policies that don't cause recursion

-- Policy 1: Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: Allow admins to view all profiles (using the function)
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (is_admin_user());

-- Policy 3: Allow admins to insert profiles
CREATE POLICY "Admins can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (is_admin_user());

-- Policy 4: Allow admins to update profiles
CREATE POLICY "Admins can update profiles" ON user_profiles
    FOR UPDATE USING (is_admin_user());

-- Policy 5: Allow admins to delete profiles
CREATE POLICY "Admins can delete profiles" ON user_profiles
    FOR DELETE USING (is_admin_user());

-- Policy 6: Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Step 4: Test the policies
-- This should not cause infinite recursion
SELECT 
    '✅ RLS Policies Fixed!' as status,
    is_admin_user() as current_user_is_admin;

-- Step 5: Verify policies are working
SELECT 
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname; 