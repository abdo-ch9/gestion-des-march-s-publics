-- Configuration de la table markets pour Supabase
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase

-- 1. Créer la table markets
CREATE TABLE IF NOT EXISTS markets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  number TEXT NOT NULL UNIQUE,
  object TEXT NOT NULL,
  service TEXT NOT NULL,
  contract_type TEXT NOT NULL,
  procurement_method TEXT NOT NULL,
  
  -- Financial Information
  estimated_amount DECIMAL(15,2),
  budget_source TEXT,
  currency TEXT DEFAULT 'MAD',
  
  -- Dates and Deadlines
  publication_date DATE,
  submission_deadline DATE,
  expected_start_date DATE,
  expected_end_date DATE,
  
  -- Contractor Information
  attributaire TEXT,
  attributaire_address TEXT,
  attributaire_phone TEXT,
  attributaire_email TEXT,
  
  -- Technical Details
  technical_specifications TEXT,
  requirements TEXT,
  deliverables TEXT,
  
  -- Additional Information
  notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled')),
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Activer RLS (Row Level Security)
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;

-- 3. Créer les politiques RLS
-- Les utilisateurs authentifiés peuvent voir tous les marchés
CREATE POLICY "Authenticated users can view markets" ON markets
  FOR SELECT USING (auth.role() = 'authenticated');

-- Les utilisateurs authentifiés peuvent créer des marchés
CREATE POLICY "Authenticated users can create markets" ON markets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Les utilisateurs peuvent modifier leurs propres marchés
CREATE POLICY "Users can update own markets" ON markets
  FOR UPDATE USING (auth.uid() = created_by);

-- Les admins peuvent modifier tous les marchés
CREATE POLICY "Admins can update all markets" ON markets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Les utilisateurs peuvent supprimer leurs propres marchés
CREATE POLICY "Users can delete own markets" ON markets
  FOR DELETE USING (auth.uid() = created_by);

-- Les admins peuvent supprimer tous les marchés
CREATE POLICY "Admins can delete all markets" ON markets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Créer un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_markets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_markets_updated_at 
  BEFORE UPDATE ON markets 
  FOR EACH ROW EXECUTE FUNCTION update_markets_updated_at();

-- 5. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_markets_number ON markets(number);
CREATE INDEX IF NOT EXISTS idx_markets_service ON markets(service);
CREATE INDEX IF NOT EXISTS idx_markets_status ON markets(status);
CREATE INDEX IF NOT EXISTS idx_markets_created_by ON markets(created_by);
CREATE INDEX IF NOT EXISTS idx_markets_publication_date ON markets(publication_date);
CREATE INDEX IF NOT EXISTS idx_markets_submission_deadline ON markets(submission_deadline);

-- 6. Donner les permissions nécessaires
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON markets TO authenticated;
GRANT EXECUTE ON FUNCTION update_markets_updated_at() TO authenticated;

-- 7. Créer une vue pour les marchés avec les informations utilisateur
CREATE OR REPLACE VIEW markets_with_creator AS
SELECT 
  m.*,
  u.email as creator_email,
  up.role as creator_role,
  up.full_name as creator_name
FROM markets m
LEFT JOIN auth.users u ON m.created_by = u.id
LEFT JOIN user_profiles up ON m.created_by = up.user_id;

-- 8. Donner les permissions sur la vue
GRANT SELECT ON markets_with_creator TO authenticated; 