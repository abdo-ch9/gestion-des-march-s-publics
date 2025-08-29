-- ========================================
-- TEST USER LOGIN FUNCTIONALITY
-- ========================================
-- This script helps diagnose login issues

-- Step 1: Check current users in both tables
SELECT '=== USER PROFILES TABLE ===' as info;
SELECT 
    id,
    email,
    full_name,
    role,
    department,
    status,
    user_id,
    password,
    created_at
FROM user_profiles 
ORDER BY created_at DESC;

-- Step 2: Check auth users (if you have access)
SELECT '=== AUTH USERS TABLE ===' as info;
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC;

-- Step 3: Check if there are any users without auth accounts
SELECT '=== USERS WITHOUT AUTH ACCOUNTS ===' as info;
SELECT 
    up.id,
    up.email,
    up.full_name,
    up.role,
    up.department,
    up.status,
    up.password
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.id IS NULL;

-- Step 4: Check if there are any auth users without profiles
SELECT '=== AUTH USERS WITHOUT PROFILES ===' as info;
SELECT 
    au.id,
    au.email,
    au.email_confirmed_at,
    au.created_at,
    au.raw_user_meta_data
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE up.id IS NULL;

-- Step 5: Check RLS policies
SELECT '=== RLS POLICIES ===' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Step 6: Test admin check function
SELECT '=== ADMIN CHECK FUNCTION ===' as info;
SELECT 
    is_admin_user() as is_admin_result; 