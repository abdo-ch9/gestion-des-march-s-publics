-- Create settlements table for tracking contract payments
-- This table will track all payments made for contracts

-- Create settlements table if it doesn't exist
CREATE TABLE IF NOT EXISTS settlements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Contract reference
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    
    -- Settlement Information
    number VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    
    -- Financial Information
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'MAD',
    
    -- Dates
    settlement_date DATE NOT NULL,
    payment_date DATE,
    due_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected', 'cancelled')),
    
    -- Payment Information
    payment_method VARCHAR(100),
    reference_number VARCHAR(100),
    
    -- Technical Details
    work_period_start DATE,
    work_period_end DATE,
    completion_percentage DECIMAL(5,2),
    
    -- Verification
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Additional Information
    notes TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_settlements_contract_id ON settlements(contract_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);
CREATE INDEX IF NOT EXISTS idx_settlements_settlement_date ON settlements(settlement_date);
CREATE INDEX IF NOT EXISTS idx_settlements_payment_date ON settlements(payment_date);
CREATE INDEX IF NOT EXISTS idx_settlements_created_by ON settlements(created_by);
CREATE INDEX IF NOT EXISTS idx_settlements_created_at ON settlements(created_at);
CREATE INDEX IF NOT EXISTS idx_settlements_number ON settlements(number);

-- Add comments for documentation
COMMENT ON TABLE settlements IS 'Table des décomptes/paiements des contrats';
COMMENT ON COLUMN settlements.contract_id IS 'Référence au contrat associé';
COMMENT ON COLUMN settlements.number IS 'Numéro unique du décompte';
COMMENT ON COLUMN settlements.description IS 'Description du décompte';
COMMENT ON COLUMN settlements.amount IS 'Montant du décompte';
COMMENT ON COLUMN settlements.currency IS 'Devise du décompte';
COMMENT ON COLUMN settlements.settlement_date IS 'Date du décompte';
COMMENT ON COLUMN settlements.payment_date IS 'Date de paiement effective';
COMMENT ON COLUMN settlements.due_date IS 'Date d''échéance du paiement';
COMMENT ON COLUMN settlements.status IS 'Statut du décompte (pending, approved, paid, rejected, cancelled)';
COMMENT ON COLUMN settlements.payment_method IS 'Méthode de paiement (virement, chèque, etc.)';
COMMENT ON COLUMN settlements.reference_number IS 'Numéro de référence du paiement';
COMMENT ON COLUMN settlements.work_period_start IS 'Début de la période de travaux';
COMMENT ON COLUMN settlements.work_period_end IS 'Fin de la période de travaux';
COMMENT ON COLUMN settlements.completion_percentage IS 'Pourcentage d''avancement des travaux';
COMMENT ON COLUMN settlements.verified_by IS 'Utilisateur qui a vérifié le décompte';
COMMENT ON COLUMN settlements.verified_at IS 'Date de vérification du décompte';
COMMENT ON COLUMN settlements.notes IS 'Notes additionnelles';
COMMENT ON COLUMN settlements.attachments IS 'Pièces jointes (JSON array)';

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_settlements_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_settlements_updated_at ON settlements;
CREATE TRIGGER update_settlements_updated_at 
    BEFORE UPDATE ON settlements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_settlements_updated_at_column();

-- Insert some sample data for testing
INSERT INTO settlements (
    contract_id,
    number,
    description,
    amount,
    currency,
    settlement_date,
    due_date,
    status,
    payment_method,
    work_period_start,
    work_period_end,
    completion_percentage,
    notes
) 
SELECT 
    c.id,
    'ST-2024-001',
    'Premier décompte - Travaux préparatoires',
    500000.00,
    'MAD',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '15 days',
    'pending',
    'Virement bancaire',
    CURRENT_DATE - INTERVAL '60 days',
    CURRENT_DATE - INTERVAL '30 days',
    25.0,
    'Premier décompte pour les travaux préparatoires et terrassement'
FROM contracts c 
WHERE c.number = 'CT-2024-001'
AND NOT EXISTS (SELECT 1 FROM settlements WHERE number = 'ST-2024-001')
LIMIT 1;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Successfully created settlements table and sample data';
END $$; 