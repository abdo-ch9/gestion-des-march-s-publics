-- Simple test script for contracts table
-- This will create a minimal contracts table to test the relationship

-- Check if markets table exists
SELECT 'Markets table exists:' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'markets') 
        THEN 'YES' 
        ELSE 'NO' 
    END as result;

-- Check markets table structure
SELECT 'Markets table columns:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'markets' 
ORDER BY ordinal_position;

-- Create simple contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    number VARCHAR(100) NOT NULL UNIQUE,
    market_id UUID REFERENCES markets(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    awardee VARCHAR(255) NOT NULL,
    initial_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'MAD',
    notification_date DATE NOT NULL,
    start_date DATE NOT NULL,
    duration_days INTEGER NOT NULL,
    service VARCHAR(100) NOT NULL,
    contract_type VARCHAR(100) NOT NULL,
    procurement_method VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create basic index
CREATE INDEX IF NOT EXISTS idx_contracts_market_id ON contracts(market_id);

-- Test insert (only if markets table has data)
INSERT INTO contracts (
    number,
    market_id,
    subject,
    awardee,
    initial_amount,
    currency,
    notification_date,
    start_date,
    duration_days,
    service,
    contract_type,
    procurement_method,
    status
) 
SELECT 
    'CT-TEST-001',
    m.id,
    'Test contract for irrigation system',
    'Test Company SARL',
    1000000.00,
    'MAD',
    '2024-01-01',
    '2024-02-01',
    180,
    'irrigation',
    'travaux',
    'appel_offres',
    'active'
FROM markets m 
LIMIT 1;

-- Verify the table was created
SELECT 'Contracts table created:' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contracts') 
        THEN 'YES' 
        ELSE 'NO' 
    END as result;

-- Show table structure
SELECT 'Contracts table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'contracts' 
ORDER BY ordinal_position;

-- Test the relationship
SELECT 'Testing relationship:' as info;
SELECT 
    c.number as contract_number,
    c.subject,
    c.awardee,
    m.number as market_number
FROM contracts c
LEFT JOIN markets m ON c.market_id = m.id;

-- Clean up (uncomment if you want to remove the test table)
-- DROP TABLE IF EXISTS contracts CASCADE;

SELECT 'Test completed successfully!' as result; 