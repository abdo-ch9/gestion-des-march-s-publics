-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number VARCHAR(50) UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  awardee VARCHAR(255) NOT NULL,
  awardee_address TEXT,
  awardee_phone VARCHAR(50),
  awardee_email VARCHAR(255),
  initial_amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'MAD',
  notification_date DATE NOT NULL,
  start_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  deadline_date DATE GENERATED ALWAYS AS (start_date + duration_days) STORED,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'overdue', 'suspended', 'cancelled')),
  service VARCHAR(100) NOT NULL,
  contract_type VARCHAR(100) NOT NULL,
  procurement_method VARCHAR(100) NOT NULL,
  budget_source VARCHAR(100) NOT NULL,
  technical_specifications TEXT,
  requirements TEXT,
  deliverables TEXT,
  notes TEXT,
  consumed_days INTEGER DEFAULT 0,
  remaining_days INTEGER DEFAULT 0,
  is_overdue BOOLEAN DEFAULT FALSE,
  is_near_deadline BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contracts_number ON contracts(number);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_service ON contracts(service);
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON contracts(created_by);
CREATE INDEX IF NOT EXISTS idx_contracts_deadline_date ON contracts(deadline_date);
CREATE INDEX IF NOT EXISTS idx_contracts_start_date ON contracts(start_date);

-- Enable Row Level Security
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view contracts they created
CREATE POLICY "Users can view own contracts" ON contracts
  FOR SELECT USING (auth.uid() = created_by);

-- Users can insert contracts
CREATE POLICY "Users can insert contracts" ON contracts
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Users can update contracts they created
CREATE POLICY "Users can update own contracts" ON contracts
  FOR UPDATE USING (auth.uid() = created_by);

-- Users can delete contracts they created
CREATE POLICY "Users can delete own contracts" ON contracts
  FOR DELETE USING (auth.uid() = created_by);

-- Admin users can view all contracts
CREATE POLICY "Admins can view all contracts" ON contracts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Admin users can manage all contracts
CREATE POLICY "Admins can manage all contracts" ON contracts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contracts_updated_at 
  BEFORE UPDATE ON contracts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate and update calculated fields
CREATE OR REPLACE FUNCTION update_contract_calculations()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate remaining days
  NEW.remaining_days = GREATEST(0, NEW.duration_days - NEW.consumed_days);
  
  -- Calculate if overdue (only for active contracts)
  IF NEW.status = 'active' AND CURRENT_DATE > NEW.deadline_date THEN
    NEW.is_overdue = TRUE;
  ELSE
    NEW.is_overdue = FALSE;
  END IF;
  
  -- Calculate if near deadline (only for active contracts)
  IF NEW.status = 'active' AND NEW.remaining_days <= 30 AND NEW.remaining_days > 0 THEN
    NEW.is_near_deadline = TRUE;
  ELSE
    NEW.is_near_deadline = FALSE;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update calculated fields
CREATE TRIGGER update_contract_calculations_trigger
  BEFORE INSERT OR UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_contract_calculations();

-- Insert sample data (optional - remove in production)
INSERT INTO contracts (
  number, subject, awardee, initial_amount, notification_date, start_date, 
  duration_days, service, contract_type, procurement_method, budget_source,
  created_by
) VALUES 
  ('CTR-2024-001', 'Réhabilitation du réseau d''eau potable', 'Entreprise ABC', 450000, '2024-01-15', '2024-02-01', 180, 'eau', 'travaux', 'appel_offres', 'budget_etat', 
   (SELECT id FROM auth.users LIMIT 1)),
  ('CTR-2024-002', 'Construction station d''épuration', 'Société XYZ', 1200000, '2024-01-20', '2024-02-15', 365, 'assainissement', 'travaux', 'appel_offres', 'budget_etat',
   (SELECT id FROM auth.users LIMIT 1)),
  ('CTR-2024-003', 'Maintenance système d''irrigation', 'Technique Plus', 180000, '2024-01-10', '2024-01-25', 90, 'irrigation', 'services', 'entente_directe', 'budget_local',
   (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT (number) DO NOTHING; 