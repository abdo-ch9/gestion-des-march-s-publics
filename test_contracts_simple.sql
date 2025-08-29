-- Simple test to create contracts table
-- This will test if the basic table creation works

-- Check if markets table exists and has data
SELECT 'Markets table check:' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'markets') 
        THEN 'Markets table exists'
        ELSE 'Markets table does not exist'
    END as table_status;

-- Check if markets table has data
SELECT 'Markets data check:' as info;
SELECT COUNT(*) as markets_count FROM markets;

-- Show sample market data
SELECT 'Sample market data:' as info;
SELECT id, number, object, service, status 
FROM markets 
LIMIT 3;

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
    m.number as market_number,
    m.object as market_object
FROM contracts c
LEFT JOIN markets m ON c.market_id = m.id;

-- Clean up (uncomment if you want to remove the test table)
-- DROP TABLE IF EXISTS contracts CASCADE;

SELECT 'Test completed successfully!' as result; 