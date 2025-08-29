-- ========================================
-- FIX EXISTING USERS WITHOUT AUTH ACCOUNTS
-- ========================================
-- This script helps create auth users for existing profiles

-- Step 1: Check which users need auth accounts
SELECT '=== USERS WITHOUT AUTH ACCOUNTS ===' as info;
SELECT 
    up.id,
    up.email,
    up.full_name,
    up.role,
    up.department,
    up.status,
    up.password,
    up.user_id
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.id IS NULL OR up.user_id IS NULL;

-- Step 2: Create auth users for existing profiles
-- You'll need to run this manually for each user in Supabase Auth dashboard
-- Or use the admin API if you have access

-- Example of what you need to do for each user:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User"
-- 3. Enter the email and password from the user_profiles table
-- 4. Set email_confirmed_at to current timestamp
-- 5. Copy the generated user ID
-- 6. Update the user_profiles table with the auth user ID

-- Step 3: Update user_profiles with auth user IDs (after creating auth users)
-- Replace the UUIDs with actual auth user IDs from step 2

/*
UPDATE user_profiles 
SET user_id = 'REPLACE_WITH_AUTH_USER_ID'
WHERE email = 'user@example.com';

UPDATE user_profiles 
SET user_id = 'REPLACE_WITH_AUTH_USER_ID'
WHERE email = 'another@example.com';
*/

-- Step 4: Verify the fix
SELECT '=== VERIFICATION ===' as info;
SELECT 
    up.id,
    up.email,
    up.full_name,
    up.role,
    up.department,
    up.status,
    up.user_id,
    CASE 
        WHEN au.id IS NOT NULL THEN '✅ Linked to Auth'
        WHEN up.user_id IS NULL THEN '❌ No Auth User'
        ELSE '❌ Broken Link'
    END as auth_status
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
ORDER BY up.created_at DESC; 