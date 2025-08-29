-- ========================================
-- SIMPLE USER PROFILES TABLE CHECK
-- ========================================
-- This is a simpler version that avoids complex syntax

-- Check if table exists
SELECT 
    'user_profiles' as table_name,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'user_profiles'
        ) THEN '✅ EXISTS' 
        ELSE '❌ DOES NOT EXIST' 
    END as status;

-- If table exists, show its columns
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Check specifically for the department column
SELECT 
    'department' as column_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND table_name = 'user_profiles' 
              AND column_name = 'department'
        ) THEN '✅ EXISTS' 
        ELSE '❌ MISSING - This is the problem!' 
    END as status;

-- Check for other important columns
SELECT 
    column_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND table_name = 'user_profiles' 
              AND column_name = columns.column_name
        ) THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as status
FROM (VALUES 
    ('id'), ('email'), ('full_name'), ('role'), ('department'), 
    ('phone'), ('status'), ('last_login'), ('created_at'), ('updated_at')
) AS required_columns(column_name);

-- Check if table has any data
SELECT 
    'Data Count' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'user_profiles'
        ) THEN (
            SELECT COUNT(*)::text FROM user_profiles
        )
        ELSE 'N/A - Table does not exist'
    END as result;

-- Check for RLS policies
SELECT 
    policyname,
    permissive,
    cmd,
    schemaname,
    tablename
FROM pg_policies 
WHERE tablename = 'user_profiles'; 