-- Add missing payment-related columns to contracts table
-- This will allow the finances system to work properly

-- Add payment status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contracts' AND column_name = 'payment_status') THEN
        ALTER TABLE contracts ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue', 'cancelled'));
    END IF;
END $$;

-- Add partial amount column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contracts' AND column_name = 'partial_amount') THEN
        ALTER TABLE contracts ADD COLUMN partial_amount DECIMAL(15,2);
    END IF;
END $$;

-- Add remaining amount column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contracts' AND column_name = 'remaining_amount') THEN
        ALTER TABLE contracts ADD COLUMN remaining_amount DECIMAL(15,2);
    END IF;
END $$;

-- Add deadline date column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contracts' AND column_name = 'deadline_date') THEN
        ALTER TABLE contracts ADD COLUMN deadline_date DATE;
    END IF;
END $$;

-- Create index for payment status
CREATE INDEX IF NOT EXISTS idx_contracts_payment_status ON contracts(payment_status);

-- Add comments for documentation
COMMENT ON COLUMN contracts.payment_status IS 'Statut de paiement du contrat (pending, partial, paid, overdue, cancelled)';
COMMENT ON COLUMN contracts.partial_amount IS 'Montant partiel payé si statut = partial';
COMMENT ON COLUMN contracts.remaining_amount IS 'Montant restant à payer';
COMMENT ON COLUMN contracts.deadline_date IS 'Date limite de paiement du contrat';

-- Update remaining amount for existing contracts
UPDATE contracts 
SET remaining_amount = initial_amount 
WHERE remaining_amount IS NULL AND payment_status IS NULL;

-- Initialize payment status for existing contracts
UPDATE contracts 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Successfully added missing payment-related columns to contracts table';
END $$; 