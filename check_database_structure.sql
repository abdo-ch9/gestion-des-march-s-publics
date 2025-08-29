-- Diagnostic script to check database structure
-- Run this first to see what exists and what's missing

-- Check if tables exist
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check contracts table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'contracts'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE '✅ Table contracts exists';
    ELSE
        RAISE NOTICE '❌ Table contracts does NOT exist';
    END IF;
    
    -- Check markets table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'markets'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE '✅ Table markets exists';
    ELSE
        RAISE NOTICE '❌ Table markets does NOT exist';
    END IF;
    
    -- Check settlements table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'settlements'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE '✅ Table settlements exists';
    ELSE
        RAISE NOTICE '❌ Table settlements does NOT exist';
    END IF;
    
    -- Check expenses table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'expenses'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE '✅ Table expenses exists';
    ELSE
        RAISE NOTICE '❌ Table expenses does NOT exist';
    END IF;
END $$;

-- Check contracts table structure if it exists
DO $$
DECLARE
    col_record RECORD;
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'contracts'
    ) THEN
        RAISE NOTICE '=== CONTRACTS TABLE STRUCTURE ===';
        FOR col_record IN 
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'contracts'
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE 'Column: % | Type: % | Nullable: % | Default: %', 
                col_record.column_name, 
                col_record.data_type, 
                col_record.is_nullable, 
                COALESCE(col_record.column_default, 'NULL');
        END LOOP;
    ELSE
        RAISE NOTICE 'Contracts table does not exist - cannot check structure';
    END IF;
END $$;

-- Check markets table structure if it exists
DO $$
DECLARE
    col_record RECORD;
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'markets'
    ) THEN
        RAISE NOTICE '=== MARKETS TABLE STRUCTURE ===';
        FOR col_record IN 
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'markets'
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE 'Column: % | Type: % | Nullable: % | Default: %', 
                col_record.column_name, 
                col_record.data_type, 
                col_record.is_nullable, 
                COALESCE(col_record.column_default, 'NULL');
        END LOOP;
    ELSE
        RAISE NOTICE 'Markets table does not exist - cannot check structure';
    END IF;
END $$;

-- Summary
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== SUMMARY ===';
    RAISE NOTICE 'Run this script to see what exists in your database.';
    RAISE NOTICE 'Based on the results, you can determine which scripts to run first.';
    RAISE NOTICE 'If contracts table is missing, run create_contracts_table_fixed.sql first.';
    RAISE NOTICE 'If markets table is missing, run fix_markets_crud_complete.sql first.';
END $$; 