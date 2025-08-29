-- Create expenses table for tracking financial expenses
-- This table will track all manual expenses and costs

-- Create expenses table if it doesn't exist
CREATE TABLE IF NOT EXISTS expenses (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_supplier ON expenses(supplier);
CREATE INDEX IF NOT EXISTS idx_expenses_created_by ON expenses(created_by);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);

-- Add comments for documentation
COMMENT ON TABLE expenses IS 'Table des dépenses et coûts manuels';
COMMENT ON COLUMN expenses.description IS 'Description de la dépense';
COMMENT ON COLUMN expenses.amount IS 'Montant de la dépense';
COMMENT ON COLUMN expenses.category IS 'Catégorie de la dépense (materiaux, maintenance, personnel, services, autres)';
COMMENT ON COLUMN expenses.date IS 'Date de la dépense';
COMMENT ON COLUMN expenses.status IS 'Statut de la dépense (pending, approved, paid, cancelled)';
COMMENT ON COLUMN expenses.payment_method IS 'Méthode de paiement (virement, chèque, espèces, etc.)';
COMMENT ON COLUMN expenses.supplier IS 'Fournisseur ou prestataire';
COMMENT ON COLUMN expenses.invoice_number IS 'Numéro de facture';
COMMENT ON COLUMN expenses.reference_number IS 'Numéro de référence du paiement';
COMMENT ON COLUMN expenses.notes IS 'Notes additionnelles';
COMMENT ON COLUMN expenses.attachments IS 'Pièces jointes (JSON array)';

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_expenses_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at 
    BEFORE UPDATE ON expenses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_expenses_updated_at_column();

-- Insert some sample data for testing
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
    ),
    (
        'Services de topographie et géomètres',
        45000.00,
        'services',
        CURRENT_DATE - INTERVAL '3 days',
        'approved',
        'Virement bancaire',
        'Cabinet Topographie Maroc',
        'INV-2024-0198',
        'Relevés topographiques pour le projet d''extension'
    ),
    (
        'Frais de déplacement et hébergement',
        12000.00,
        'autres',
        CURRENT_DATE - INTERVAL '1 day',
        'pending',
        'Carte entreprise',
        'Divers fournisseurs',
        'MISC-2024-03',
        'Frais de mission pour supervision des travaux'
    )
ON CONFLICT DO NOTHING;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Successfully created expenses table and sample data';
END $$; 