-- ========================================
-- CHECK USER PROFILES TABLE STATUS
-- ========================================
-- Run this first to see what's currently in your database

-- Check if table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'user_profiles'
        ) THEN '✅ EXISTS' 
        ELSE '❌ DOES NOT EXIST' 
    END as table_status,
    'user_profiles' as table_name;

-- If table exists, show its structure
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_profiles'
    ) THEN
        RAISE NOTICE '=== CURRENT TABLE STRUCTURE ===';
        FOR col_record IN 
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'user_profiles'
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE 'Column: % | Type: % | Nullable: % | Default: %', 
                col_record.column_name, 
                col_record.data_type, 
                col_record.is_nullable, 
                COALESCE(col_record.column_default, 'NULL');
        END LOOP;
        
        -- Check if department column exists specifically
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND table_name = 'user_profiles' 
              AND column_name = 'department'
        ) THEN
            RAISE NOTICE '✅ Department column EXISTS';
        ELSE
            RAISE NOTICE '❌ Department column MISSING - this is the problem!';
        END IF;
        
        -- Show sample data if any exists
        RAISE NOTICE '=== SAMPLE DATA (if any) ===';
        FOR data_record IN 
            SELECT * FROM user_profiles LIMIT 3
        LOOP
            RAISE NOTICE 'User: %', data_record;
        END LOOP;
        
    ELSE
        RAISE NOTICE 'Table does not exist - you need to create it first';
    END IF;
END $$;

-- Check for any existing policies
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

-- Check table permissions
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'user_profiles'; 