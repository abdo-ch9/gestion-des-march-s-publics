-- Simple contracts table creation
-- Run this first to create the basic table structure

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

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_contracts_market_id ON contracts(market_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_number ON contracts(number);

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

-- Verify table creation
SELECT 'Contracts table created successfully!' as result;
SELECT table_name FROM information_schema.tables WHERE table_name = 'contracts'; 