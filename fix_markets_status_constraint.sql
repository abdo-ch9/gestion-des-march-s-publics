-- Fix the markets status constraint issue
-- The error shows that 'draft' is not allowed by the current constraint

-- First, let's see what the current constraint allows
SELECT 'Current constraint definition:' as info;
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'markets'::regclass 
AND conname = 'markets_status_check';

-- Drop the existing constraint
ALTER TABLE markets DROP CONSTRAINT IF EXISTS markets_status_check;

-- Create a new constraint that allows the values we need
ALTER TABLE markets ADD CONSTRAINT markets_status_check 
CHECK (status IN ('open', 'closed', 'awarded', 'draft', 'pending', 'cancelled'));

-- Verify the new constraint
SELECT 'New constraint created:' as info;
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'markets'::regclass 
AND conname = 'markets_status_check';

-- Test the insert again to make sure it works
SELECT 'Testing insert with new constraint:' as info;
DO $$
BEGIN
  BEGIN
    INSERT INTO markets (
      title, 
      description, 
      budget, 
      status, 
      object,
      estimated_amount,
      budget_source,
      currency,
      created_by
    ) VALUES (
      'Test Market 2',
      'Test Description 2',
      1000.00,
      'draft',
      'Test Object 2',
      1000.00,
      'test_budget',
      'MAD',
      '00000000-0000-0000-0000-000000000000'::uuid
    );
    RAISE NOTICE 'Test insert succeeded with new constraint';
    
    -- Clean up the test data
    DELETE FROM markets WHERE title = 'Test Market 2';
    RAISE NOTICE 'Test data cleaned up';
    
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Test insert still failed: %', SQLERRM;
  END;
END $$; 