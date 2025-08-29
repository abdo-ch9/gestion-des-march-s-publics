-- Debug script to identify markets table insert issues
-- Run this in your Supabase SQL Editor to see what's wrong

-- 1. Check if the markets table exists
SELECT 'Table exists check:' as info;
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'markets'
) as table_exists;

-- 2. Show current table structure
SELECT 'Current table structure:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'markets' 
ORDER BY ordinal_position;

-- 3. Check table constraints
SELECT 'Table constraints:' as info;
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'markets';

-- 4. Check for any NOT NULL constraints that might be missing values
SELECT 'NOT NULL columns:' as info;
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'markets' 
AND is_nullable = 'NO'
ORDER BY column_name;

-- 5. Check if RLS is enabled and what policies exist
SELECT 'RLS status:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'markets';

SELECT 'RLS policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'markets';

-- 6. Try a minimal insert to see what the exact error is
SELECT 'Testing minimal insert:' as info;
DO $$
BEGIN
  BEGIN
    INSERT INTO markets (title, description, budget, status, created_by)
    VALUES ('Test Market', 'Test Description', 1000.00, 'draft', '00000000-0000-0000-0000-000000000000'::uuid);
    RAISE NOTICE 'Minimal insert succeeded';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Minimal insert failed: %', SQLERRM;
  END;
END $$; 