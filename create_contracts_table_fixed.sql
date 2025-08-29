-- Fixed contracts table creation
-- This script handles the generated column issue and creates a working contracts table

-- First, let's check what we're working with
SELECT 'Checking current database state:' as info;

-- Check if contracts table already exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contracts') 
        THEN 'Contracts table already exists'
        ELSE 'Contracts table does not exist'
    END as table_status;

-- Check markets table structure
SELECT 'Markets table columns:' as info;
SELECT column_name, data_type, is_nullable, column_default, is_generated
FROM information_schema.columns 
WHERE table_name = 'markets' 
ORDER BY ordinal_position;

-- Drop existing contracts table if it exists (to start fresh)
DROP TABLE IF EXISTS contracts CASCADE;

-- Create the contracts table with corrected structure
CREATE TABLE contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Contract Information
    number VARCHAR(100) NOT NULL UNIQUE,
    market_id UUID REFERENCES markets(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    
    -- Awardee Information
    awardee VARCHAR(255) NOT NULL,
    awardee_address TEXT,
    awardee_phone VARCHAR(50),
    awardee_email VARCHAR(255),
    
    -- Financial Information
    initial_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'MAD',
    
    -- Dates (removed deadline_date since it's generated)
    notification_date DATE NOT NULL,
    start_date DATE NOT NULL,
    duration_days INTEGER NOT NULL,
    
    -- Contract Details
    service VARCHAR(100) NOT NULL,
    contract_type VARCHAR(100) NOT NULL,
    procurement_method VARCHAR(100) NOT NULL,
    budget_source VARCHAR(100),
    
    -- Technical Details
    technical_specifications TEXT,
    requirements TEXT,
    deliverables TEXT,
    
    -- Additional Information
    notes TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'suspended', 'cancelled')),
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create basic indexes
CREATE INDEX idx_contracts_market_id ON contracts(market_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_number ON contracts(number);
CREATE INDEX idx_contracts_service ON contracts(service);
CREATE INDEX idx_contracts_created_at ON contracts(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_contracts_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contracts_updated_at 
    BEFORE UPDATE ON contracts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_contracts_updated_at_column();

-- Insert sample data (without deadline_date)
INSERT INTO contracts (
    number,
    market_id,
    subject,
    awardee,
    awardee_address,
    awardee_phone,
    awardee_email,
    initial_amount,
    currency,
    notification_date,
    start_date,
    duration_days,
    service,
    contract_type,
    procurement_method,
    budget_source,
    technical_specifications,
    requirements,
    deliverables,
    notes,
    status,
    created_by
) 
SELECT 
    'CT-2024-001',
    m.id,
    'Exécution des travaux d''irrigation pour la zone agricole',
    'Entreprise Agricole Plus SARL',
    '123 Rue de l''Agriculture, Casablanca',
    '+212-5-22-123456',
    'contact@agricoleplus.ma',
    2500000.00,
    'MAD',
    '2024-01-15',
    '2024-02-01',
    334,
    'irrigation',
    'travaux',
    'appel_offres',
    'Budget régional',
    'Installation complète du système d''irrigation avec pompes et canalisations',
    'Respect des normes techniques agricoles, formation du personnel',
    'Système d''irrigation fonctionnel, documentation technique, formation du personnel',
    'Contrat pilote pour la modernisation agricole',
    'active',
    NULL
FROM markets m 
WHERE m.number = 'MP-2024-001'
LIMIT 1;

-- Verify the final structure
SELECT 'Final contracts table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'contracts' 
ORDER BY ordinal_position;

-- Show the sample data
SELECT 'Sample contracts data:' as info;
SELECT 
    c.number, 
    c.subject, 
    c.awardee, 
    c.status, 
    c.initial_amount, 
    c.currency,
    m.number as market_number
FROM contracts c
LEFT JOIN markets m ON c.market_id = m.id;

-- Verify the relationship
SELECT 'Relationship verification:' as info;
SELECT 
    'Foreign key constraint exists:' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'contracts_market_id_fkey' 
            AND table_name = 'contracts'
        ) THEN 'YES' 
        ELSE 'NO' 
    END as result;

SELECT 'Contracts table setup completed successfully!' as result; 