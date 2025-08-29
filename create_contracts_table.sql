-- Create contracts table with proper relationships to markets
-- This script will create the contracts table and establish the relationship with markets

-- First, let's check if the markets table exists and has the right structure
SELECT 'Checking markets table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'markets' 
ORDER BY ordinal_position;

-- Create the contracts table
CREATE TABLE IF NOT EXISTS contracts (
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
    
    -- Dates
    notification_date DATE NOT NULL,
    start_date DATE NOT NULL,
    deadline_date DATE NOT NULL,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contracts_market_id ON contracts(market_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_service ON contracts(service);
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON contracts(created_by);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON contracts(created_at);
CREATE INDEX IF NOT EXISTS idx_contracts_number ON contracts(number);
CREATE INDEX IF NOT EXISTS idx_contracts_start_date ON contracts(start_date);
CREATE INDEX IF NOT EXISTS idx_contracts_deadline_date ON contracts(deadline_date);

-- Add comments for documentation
COMMENT ON TABLE contracts IS 'Table des contrats liés aux marchés publics';
COMMENT ON COLUMN contracts.number IS 'Numéro unique du contrat';
COMMENT ON COLUMN contracts.market_id IS 'Référence vers le marché public associé';
COMMENT ON COLUMN contracts.subject IS 'Objet du contrat';
COMMENT ON COLUMN contracts.awardee IS 'Nom de l''entreprise attributaire du contrat';
COMMENT ON COLUMN contracts.awardee_address IS 'Adresse de l''attributaire';
COMMENT ON COLUMN contracts.awardee_phone IS 'Téléphone de l''attributaire';
COMMENT ON COLUMN contracts.awardee_email IS 'Email de l''attributaire';
COMMENT ON COLUMN contracts.initial_amount IS 'Montant initial du contrat';
COMMENT ON COLUMN contracts.currency IS 'Devise du contrat';
COMMENT ON COLUMN contracts.notification_date IS 'Date de notification d''attribution';
COMMENT ON COLUMN contracts.start_date IS 'Date de début du contrat';
COMMENT ON COLUMN contracts.deadline_date IS 'Date limite d''exécution';
COMMENT ON COLUMN contracts.duration_days IS 'Durée du contrat en jours';
COMMENT ON COLUMN contracts.service IS 'Service responsable du contrat';
COMMENT ON COLUMN contracts.contract_type IS 'Type de contrat (travaux, services, fournitures, etc.)';
COMMENT ON COLUMN contracts.procurement_method IS 'Méthode de passation du contrat';
COMMENT ON COLUMN contracts.budget_source IS 'Source du budget';
COMMENT ON COLUMN contracts.technical_specifications IS 'Spécifications techniques du contrat';
COMMENT ON COLUMN contracts.requirements IS 'Exigences et conditions du contrat';
COMMENT ON COLUMN contracts.deliverables IS 'Livrables attendus';
COMMENT ON COLUMN contracts.notes IS 'Notes additionnelles';
COMMENT ON COLUMN contracts.status IS 'Statut du contrat (draft, active, completed, suspended, cancelled)';

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_contracts_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_contracts_updated_at ON contracts;
CREATE TRIGGER update_contracts_updated_at 
    BEFORE UPDATE ON contracts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_contracts_updated_at_column();

-- Insert some sample data for testing (only if markets table has data)
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
    deadline_date,
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
    '2024-12-31',
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