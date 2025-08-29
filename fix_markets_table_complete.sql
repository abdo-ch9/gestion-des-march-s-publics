-- Complete fix for markets table
-- This script will ensure all required columns exist and the table structure is correct

-- First, let's check what we currently have
SELECT 'Current table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'markets' 
ORDER BY ordinal_position;

-- Add all missing columns that the frontend expects
-- Basic information
ALTER TABLE markets ADD COLUMN IF NOT EXISTS object TEXT;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS estimated_amount DECIMAL(15,2);
ALTER TABLE markets ADD COLUMN IF NOT EXISTS budget_source VARCHAR(100);
ALTER TABLE markets ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'MAD';

-- Dates
ALTER TABLE markets ADD COLUMN IF NOT EXISTS expected_start_date DATE;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS expected_end_date DATE;

-- Contractor information
ALTER TABLE markets ADD COLUMN IF NOT EXISTS attributaire VARCHAR(255);
ALTER TABLE markets ADD COLUMN IF NOT EXISTS attributaire_address TEXT;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS attributaire_phone VARCHAR(50);
ALTER TABLE markets ADD COLUMN IF NOT EXISTS attributaire_email VARCHAR(255);

-- Technical details
ALTER TABLE markets ADD COLUMN IF NOT EXISTS technical_specifications TEXT;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS requirements TEXT;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS deliverables TEXT;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS notes TEXT;

-- Ensure required columns have proper defaults and constraints
ALTER TABLE markets ALTER COLUMN status SET DEFAULT 'draft';
ALTER TABLE markets ALTER COLUMN currency SET DEFAULT 'MAD';

-- Add comments for documentation
COMMENT ON COLUMN markets.object IS 'Objet du marché public';
COMMENT ON COLUMN markets.estimated_amount IS 'Montant estimé du marché';
COMMENT ON COLUMN markets.budget_source IS 'Source du budget';
COMMENT ON COLUMN markets.currency IS 'Devise du marché';
COMMENT ON COLUMN markets.expected_start_date IS 'Date de début prévue';
COMMENT ON COLUMN markets.expected_end_date IS 'Date de fin prévue';
COMMENT ON COLUMN markets.attributaire IS 'Nom de l''entreprise attributaire du marché';
COMMENT ON COLUMN markets.attributaire_address IS 'Adresse de l''attributaire';
COMMENT ON COLUMN markets.attributaire_phone IS 'Téléphone de l''attributaire';
COMMENT ON COLUMN markets.attributaire_email IS 'Email de l''attributaire';
COMMENT ON COLUMN markets.technical_specifications IS 'Spécifications techniques';
COMMENT ON COLUMN markets.requirements IS 'Exigences du marché';
COMMENT ON COLUMN markets.deliverables IS 'Livrables attendus';
COMMENT ON COLUMN markets.notes IS 'Notes additionnelles';

-- Verify the final structure
SELECT 'Final table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'markets' 
ORDER BY ordinal_position;

-- Test insert to verify everything works
-- (This will be rolled back, it's just a test)
BEGIN;
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
    'Test Market',
    'Test Description',
    1000.00,
    'draft',
    'Test Object',
    1000.00,
    'test_budget',
    'MAD',
    '00000000-0000-0000-0000-000000000000'::uuid
  );
ROLLBACK;

SELECT 'Test completed successfully!' as result; 