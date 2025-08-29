-- Simple script to add missing columns to contracts table
-- This script will add the required columns for the finances system

-- Add payment status column
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';

-- Add partial amount column
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS partial_amount DECIMAL(15,2);

-- Add remaining amount column
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS remaining_amount DECIMAL(15,2);

-- Add deadline date column
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS deadline_date DATE;

-- Create index for payment status
CREATE INDEX IF NOT EXISTS idx_contracts_payment_status ON contracts(payment_status);

-- Add comments for documentation
COMMENT ON COLUMN contracts.payment_status IS 'Statut de paiement du contrat (pending, partial, paid, overdue, cancelled)';
COMMENT ON COLUMN contracts.partial_amount IS 'Montant partiel payé si statut = partial';
COMMENT ON COLUMN contracts.remaining_amount IS 'Montant restant à payer';
COMMENT ON COLUMN contracts.deadline_date IS 'Date limite de paiement du contrat';

-- Initialize missing data for existing contracts
UPDATE contracts 
SET remaining_amount = initial_amount 
WHERE remaining_amount IS NULL;

UPDATE contracts 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;

-- Calculate deadline date based on start date and duration (if both exist)
UPDATE contracts 
SET deadline_date = start_date + INTERVAL '1 day' * duration_days
WHERE deadline_date IS NULL AND start_date IS NOT NULL AND duration_days IS NOT NULL;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE '✅ Successfully added missing payment-related columns to contracts table';
    RAISE NOTICE '📊 Contracts table is now ready for the finances system';
END $$; 