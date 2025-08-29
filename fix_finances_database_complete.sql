-- Complete database fix for finances system
-- This script fixes all the database structure issues that cause the finances page error

-- 1. First, add missing payment-related columns to contracts table
DO $$ 
BEGIN
    -- Add payment status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contracts' AND column_name = 'payment_status') THEN
        ALTER TABLE contracts ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue', 'cancelled'));
        RAISE NOTICE 'Added payment_status column to contracts table';
    END IF;

    -- Add partial amount column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contracts' AND column_name = 'partial_amount') THEN
        ALTER TABLE contracts ADD COLUMN partial_amount DECIMAL(15,2);
        RAISE NOTICE 'Added partial_amount column to contracts table';
    END IF;

    -- Add remaining amount column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contracts' AND column_name = 'remaining_amount') THEN
        ALTER TABLE contracts ADD COLUMN remaining_amount DECIMAL(15,2);
        RAISE NOTICE 'Added remaining_amount column to contracts table';
    END IF;

    -- Add deadline date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contracts' AND column_name = 'deadline_date') THEN
        ALTER TABLE contracts ADD COLUMN deadline_date DATE;
        RAISE NOTICE 'Added deadline_date column to contracts table';
    END IF;
END $$;

-- 2. Create settlements table if it doesn't exist
CREATE TABLE IF NOT EXISTS settlements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    number VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'MAD',
    settlement_date DATE NOT NULL,
    payment_date DATE,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected', 'cancelled')),
    payment_method VARCHAR(100),
    reference_number VARCHAR(100),
    work_period_start DATE,
    work_period_end DATE,
    completion_percentage DECIMAL(5,2),
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create expenses table if it doesn't exist
CREATE TABLE IF NOT EXISTS expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('materiaux', 'maintenance', 'personnel', 'services', 'autres')),
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    payment_method VARCHAR(100),
    supplier VARCHAR(255),
    invoice_number VARCHAR(100),
    reference_number VARCHAR(100),
    notes TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contracts_payment_status ON contracts(payment_status);
CREATE INDEX IF NOT EXISTS idx_settlements_contract_id ON settlements(contract_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);
CREATE INDEX IF NOT EXISTS idx_settlements_settlement_date ON settlements(settlement_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

-- 5. Create update triggers for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
DROP TRIGGER IF EXISTS update_settlements_updated_at ON settlements;
CREATE TRIGGER update_settlements_updated_at 
    BEFORE UPDATE ON settlements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at 
    BEFORE UPDATE ON expenses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Initialize missing data for existing contracts
DO $$
BEGIN
    -- Update remaining amount for existing contracts
    UPDATE contracts 
    SET remaining_amount = initial_amount 
    WHERE remaining_amount IS NULL;

    -- Initialize payment status for existing contracts
    UPDATE contracts 
    SET payment_status = 'pending' 
    WHERE payment_status IS NULL;

    -- Calculate deadline date based on start date and duration
    UPDATE contracts 
    SET deadline_date = start_date + INTERVAL '1 day' * duration_days
    WHERE deadline_date IS NULL AND start_date IS NOT NULL AND duration_days IS NOT NULL;

    RAISE NOTICE 'Initialized missing data for existing contracts';
END $$;

-- 7. Insert sample data for testing
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

INSERT INTO expenses (
    description,
    amount,
    category,
    date,
    status,
    payment_method,
    supplier,
    invoice_number,
    notes
) VALUES
    (
        'Achat de matériaux de construction - Ciment et fer à béton',
        125000.00,
        'materiaux',
        CURRENT_DATE - INTERVAL '15 days',
        'paid',
        'Virement bancaire',
        'Matériaux Bâtiment Pro SARL',
        'INV-2024-0156',
        'Matériaux pour le projet d''irrigation - Phase 1'
    ),
    (
        'Maintenance des véhicules de chantier',
        25000.00,
        'maintenance',
        CURRENT_DATE - INTERVAL '10 days',
        'paid',
        'Chèque',
        'Garage Technique Auto',
        'INV-2024-0287',
        'Révision et réparation des engins de terrassement'
    ),
    (
        'Salaires équipe technique - Février 2024',
        180000.00,
        'personnel',
        CURRENT_DATE - INTERVAL '5 days',
        'pending',
        'Virement bancaire',
        'Personnel interne',
        'PAY-2024-02',
        'Salaires de l''équipe technique pour le mois de février'
    )
ON CONFLICT DO NOTHING;

-- 8. Add table comments for documentation
COMMENT ON COLUMN contracts.payment_status IS 'Statut de paiement du contrat (pending, partial, paid, overdue, cancelled)';
COMMENT ON COLUMN contracts.partial_amount IS 'Montant partiel payé si statut = partial';
COMMENT ON COLUMN contracts.remaining_amount IS 'Montant restant à payer';
COMMENT ON COLUMN contracts.deadline_date IS 'Date limite de paiement du contrat';

COMMENT ON TABLE settlements IS 'Table des décomptes/paiements des contrats';
COMMENT ON TABLE expenses IS 'Table des dépenses et coûts manuels';

-- 9. Final verification and summary
DO $$
DECLARE
    contracts_count INTEGER;
    settlements_count INTEGER;
    expenses_count INTEGER;
    markets_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO contracts_count FROM contracts;
    SELECT COUNT(*) INTO settlements_count FROM settlements;
    SELECT COUNT(*) INTO expenses_count FROM expenses;
    SELECT COUNT(*) INTO markets_count FROM markets;
    
    RAISE NOTICE '=== DATABASE FINANCE SYSTEM SETUP COMPLETE ===';
    RAISE NOTICE 'Contracts: % records', contracts_count;
    RAISE NOTICE 'Settlements: % records', settlements_count;
    RAISE NOTICE 'Expenses: % records', expenses_count;
    RAISE NOTICE 'Markets: % records', markets_count;
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'The finances page should now work correctly!';
END $$; 