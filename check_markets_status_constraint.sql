-- Check the status constraint on markets table
-- This will show us what values are allowed for the status field

-- Check the constraint definition
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'markets'::regclass 
AND conname = 'markets_status_check';

-- Check what values are currently in the status column
SELECT DISTINCT status, COUNT(*) as count
FROM markets 
GROUP BY status;

-- Check the table structure for the status column
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'markets' 
AND column_name = 'status';

-- Try to see what the check constraint actually allows
SELECT 
    conname,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'markets'::regclass; 