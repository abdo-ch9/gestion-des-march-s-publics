-- Complete fix for markets CRUD operations
-- This script will ensure all required columns exist and the table structure is correct

-- First, let's check what we currently have
SELECT 'Current table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'markets' 
ORDER BY ordinal_position;

-- Drop and recreate the markets table with proper structure
DROP TABLE IF EXISTS markets CASCADE;

CREATE TABLE markets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Information
    number VARCHAR(100) NOT NULL UNIQUE,
    object TEXT NOT NULL,
    service VARCHAR(100) NOT NULL,
    contract_type VARCHAR(100) NOT NULL,
    procurement_method VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled')),
    
    -- Financial Information
    estimated_amount DECIMAL(15,2),
    budget_source VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'MAD',
    
    -- Dates and Deadlines
    publication_date DATE,
    submission_deadline DATE,
    expected_start_date DATE,
    expected_end_date DATE,
    
    -- Contractor Information
    attributaire VARCHAR(255),
    attributaire_address TEXT,
    attributaire_phone VARCHAR(50),
    attributaire_email VARCHAR(255),
    
    -- Technical Details
    technical_specifications TEXT,
    requirements TEXT,
    deliverables TEXT,
    
    -- Additional Information
    notes TEXT,
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_markets_status ON markets(status);
CREATE INDEX idx_markets_service ON markets(service);
CREATE INDEX idx_markets_created_by ON markets(created_by);
CREATE INDEX idx_markets_created_at ON markets(created_at);
CREATE INDEX idx_markets_number ON markets(number);

-- Add comments for documentation
COMMENT ON TABLE markets IS 'Table des marchés publics';
COMMENT ON COLUMN markets.number IS 'Numéro unique du marché public';
COMMENT ON COLUMN markets.object IS 'Objet du marché public';
COMMENT ON COLUMN markets.service IS 'Service responsable du marché';
COMMENT ON COLUMN markets.contract_type IS 'Type de contrat (travaux, services, fournitures, etc.)';
COMMENT ON COLUMN markets.procurement_method IS 'Méthode de passation du marché';
COMMENT ON COLUMN markets.status IS 'Statut du marché (draft, published, in_progress, completed, cancelled)';
COMMENT ON COLUMN markets.estimated_amount IS 'Montant estimé du marché';
COMMENT ON COLUMN markets.budget_source IS 'Source du budget';
COMMENT ON COLUMN markets.currency IS 'Devise du marché';
COMMENT ON COLUMN markets.publication_date IS 'Date de publication du marché';
COMMENT ON COLUMN markets.submission_deadline IS 'Date limite de soumission';
COMMENT ON COLUMN markets.expected_start_date IS 'Date de début prévue';
COMMENT ON COLUMN markets.expected_end_date IS 'Date de fin prévue';
COMMENT ON COLUMN markets.attributaire IS 'Nom de l''entreprise attributaire du marché';
COMMENT ON COLUMN markets.attributaire_address IS 'Adresse de l''attributaire';
COMMENT ON COLUMN markets.attributaire_phone IS 'Téléphone de l''attributaire';
COMMENT ON COLUMN markets.attributaire_email IS 'Email de l''attributaire';
COMMENT ON COLUMN markets.technical_specifications IS 'Spécifications techniques du marché';
COMMENT ON COLUMN markets.requirements IS 'Exigences et conditions du marché';
COMMENT ON COLUMN markets.deliverables IS 'Livrables attendus';
COMMENT ON COLUMN markets.notes IS 'Notes additionnelles';

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_markets_updated_at 
    BEFORE UPDATE ON markets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO markets (
    number,
    object,
    service,
    contract_type,
    procurement_method,
    status,
    estimated_amount,
    currency,
    expected_start_date,
    expected_end_date,
    created_by
) VALUES 
(
    'MP-2024-001',
    'Installation d''un système d''irrigation pour la zone agricole de la vallée',
    'irrigation',
    'travaux',
    'appel_offres',
    'draft',
    2500000.00,
    'MAD',
    '2024-06-01',
    '2024-12-31',
    NULL
),
(
    'MP-2024-002',
    'Formation du personnel sur les nouvelles technologies agricoles',
    'formation',
    'services',
    'entente_directe',
    'published',
    500000.00,
    'MAD',
    '2024-07-01',
    '2024-09-30',
    NULL
),
(
    'MP-2024-003',
    'Achat d''équipements informatiques pour le bureau',
    'informatique',
    'fournitures',
    'demande_prix',
    'in_progress',
    150000.00,
    'MAD',
    '2024-05-01',
    '2024-08-31',
    NULL
);

-- Verify the final structure
SELECT 'Final table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'markets' 
ORDER BY ordinal_position;

-- Show the sample data
SELECT 'Sample data:' as info;
SELECT number, object, service, status, estimated_amount, currency FROM markets;

SELECT 'Markets CRUD setup completed successfully!' as result; 