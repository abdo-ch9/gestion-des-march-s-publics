-- Comprehensive diagnostic and fix script for finances database
-- This script will diagnose issues and fix them step by step

-- ========================================
-- STEP 1: COMPREHENSIVE DIAGNOSTIC
-- ========================================

DO $$
DECLARE
    table_name_var TEXT;
    col_record RECORD;
    col_count INTEGER;
BEGIN
    RAISE NOTICE '🔍 === COMPREHENSIVE DATABASE DIAGNOSTIC ===';
    
    -- Check all relevant tables
    FOR table_name_var IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('markets', 'contracts', 'settlements', 'expenses')
        ORDER BY table_name
    LOOP
        RAISE NOTICE '✅ Table % exists', table_name_var;
        
        -- Count columns in each table
        SELECT COUNT(*) INTO col_count
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = table_name_var;
        
        RAISE NOTICE '   📊 Column count: %', col_count;
        
        -- Show column details
        RAISE NOTICE '   📋 Columns:';
        FOR col_record IN 
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = table_name_var
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE '      - % (%)', 
                col_record.column_name, 
                col_record.data_type;
        END LOOP;
    END LOOP;
    
    -- Check for missing tables
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'markets') THEN
        RAISE NOTICE '❌ Table markets does NOT exist';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contracts') THEN
        RAISE NOTICE '❌ Table contracts does NOT exist';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'settlements') THEN
        RAISE NOTICE '❌ Table settlements does NOT exist';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'expenses') THEN
        RAISE NOTICE '❌ Table expenses does NOT exist';
    END IF;
    
END $$;

-- ========================================
-- STEP 2: DROP AND RECREATE TABLES IF NEEDED
-- ========================================

-- Drop existing tables if they have wrong structure
DO $$
BEGIN
    -- Drop settlements table if it exists (will recreate with correct structure)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'settlements') THEN
        DROP TABLE settlements CASCADE;
        RAISE NOTICE '🗑️  Dropped existing settlements table (will recreate with correct structure)';
    END IF;
    
    -- Drop expenses table if it exists (will recreate with correct structure)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'expenses') THEN
        DROP TABLE expenses CASCADE;
        RAISE NOTICE '🗑️  Dropped existing expenses table (will recreate with correct structure)';
    END IF;
END $$;

-- ========================================
-- STEP 3: CREATE EXPENSES TABLE (NO DEPENDENCIES)
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '📊 Creating expenses table...';
END $$;

CREATE TABLE expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Expense Information
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('materiaux', 'maintenance', 'personnel', 'services', 'autres')),
    
    -- Dates
    date DATE NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    
    -- Payment Information
    payment_method VARCHAR(100),
    supplier VARCHAR(255),
    invoice_number VARCHAR(100),
    reference_number VARCHAR(100),
    
    -- Additional Information
    notes TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_supplier ON expenses(supplier);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);
CREATE INDEX idx_expenses_created_at ON expenses(created_at);

-- Add comments
COMMENT ON TABLE expenses IS 'Table des dépenses et coûts manuels';

-- Create update trigger
CREATE OR REPLACE FUNCTION update_expenses_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_expenses_updated_at 
    BEFORE UPDATE ON expenses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_expenses_updated_at_column();

DO $$
BEGIN
    RAISE NOTICE '✅ Expenses table created successfully';
END $$;

-- ========================================
-- STEP 4: CREATE SETTLEMENTS TABLE (DEPENDS ON CONTRACTS)
-- ========================================

-- Check if contracts table exists and has required structure
DO $$
DECLARE
    contracts_exists BOOLEAN;
    status_col_exists BOOLEAN;
BEGIN
    -- Check if contracts table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'contracts'
    ) INTO contracts_exists;
    
    IF NOT contracts_exists THEN
        RAISE EXCEPTION 'Contracts table does not exist. Please run create_contracts_table_fixed.sql first.';
    END IF;
    
    -- Check if contracts table has status column
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'contracts' AND column_name = 'status'
    ) INTO status_col_exists;
    
    IF NOT status_col_exists THEN
        RAISE EXCEPTION 'Contracts table is missing status column. Please run add_missing_contracts_columns.sql first.';
    END IF;
    
    RAISE NOTICE '✅ Contracts table exists and has required structure';
END $$;

DO $$
BEGIN
    RAISE NOTICE '📊 Creating settlements table...';
END $$;

CREATE TABLE settlements (
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

-- Create indexes
CREATE INDEX idx_settlements_contract_id ON settlements(contract_id);
CREATE INDEX idx_settlements_status ON settlements(status);
CREATE INDEX idx_settlements_settlement_date ON settlements(settlement_date);
CREATE INDEX idx_settlements_payment_date ON settlements(payment_date);
CREATE INDEX idx_settlements_created_by ON settlements(created_by);
CREATE INDEX idx_settlements_created_at ON settlements(created_at);
CREATE INDEX idx_settlements_number ON settlements(number);

-- Add comments
COMMENT ON TABLE settlements IS 'Table des décomptes/paiements des contrats';

-- Create update trigger
CREATE OR REPLACE FUNCTION update_settlements_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_settlements_updated_at 
    BEFORE UPDATE ON settlements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_settlements_updated_at_column();

DO $$
BEGIN
    RAISE NOTICE '✅ Settlements table created successfully';
END $$;

-- ========================================
-- STEP 5: INSERT SAMPLE DATA
-- ========================================

-- Insert sample expenses data
DO $$
BEGIN
    RAISE NOTICE '💰 Inserting sample expenses data...';
END $$;

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

DO $$
BEGIN
    RAISE NOTICE '✅ Sample expenses data inserted';
END $$;

-- Insert sample settlements data (only if contracts exist and have data)
DO $$
DECLARE
    contract_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO contract_count FROM contracts;
    
    IF contract_count > 0 THEN
        RAISE NOTICE '💰 Inserting sample settlements data...';
        
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
        
        RAISE NOTICE '✅ Sample settlements data inserted';
    ELSE
        RAISE NOTICE '⚠️  No contracts found - skipping settlements sample data';
    END IF;
END $$;

-- ========================================
-- STEP 6: FINAL VERIFICATION
-- ========================================

DO $$
DECLARE
    expenses_count INTEGER;
    settlements_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO expenses_count FROM expenses;
    SELECT COUNT(*) INTO settlements_count FROM settlements;
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 === SETUP COMPLETE ===';
    RAISE NOTICE '✅ Expenses table: % records', expenses_count;
    RAISE NOTICE '✅ Settlements table: % records', settlements_count;
    RAISE NOTICE '📊 Both tables are ready for use!';
    RAISE NOTICE '🚀 The finances page should now work correctly!';
END $$; 