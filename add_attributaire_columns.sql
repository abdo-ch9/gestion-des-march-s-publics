-- Add missing attributaire columns to markets table
-- These columns are referenced in the frontend but don't exist in the database

-- Add attributaire columns
ALTER TABLE markets ADD COLUMN IF NOT EXISTS attributaire VARCHAR(255);
ALTER TABLE markets ADD COLUMN IF NOT EXISTS attributaire_address TEXT;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS attributaire_phone VARCHAR(50);
ALTER TABLE markets ADD COLUMN IF NOT EXISTS attributaire_email VARCHAR(255);

-- Add comments to describe the columns
COMMENT ON COLUMN markets.attributaire IS 'Nom de l''entreprise attributaire du marché';
COMMENT ON COLUMN markets.attributaire_address IS 'Adresse de l''attributaire';
COMMENT ON COLUMN markets.attributaire_phone IS 'Téléphone de l''attributaire';
COMMENT ON COLUMN markets.attributaire_email IS 'Email de l''attributaire';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'markets' 
AND column_name IN ('attributaire', 'attributaire_address', 'attributaire_phone', 'attributaire_email')
ORDER BY column_name; 