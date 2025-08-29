# Fix for Contracts Table Relationship Error

## Problem
You're getting this error when accessing the Contrats page:
```
Erreur lors de la récupération des contrats: Could not find a relationship between 'contracts' and 'markets' in the schema cache
```

## Root Cause
The `contracts` table doesn't exist in your Supabase database, but your React code is trying to query it and join it with the `markets` table.

## Solution
You need to create the `contracts` table in your Supabase database with the proper foreign key relationship to the `markets` table.

## Steps to Fix

### Option 1: Run the Complete Setup (Recommended)
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `create_contracts_table.sql`
4. Run the script

This will:
- Create the contracts table with all necessary columns
- Establish the foreign key relationship with markets
- Add sample data for testing
- Create proper indexes and triggers

### Option 2: Run the Simple Setup First
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `create_contracts_table_simple.sql`
4. Run the script

This creates just the basic table structure without sample data.

## What the Script Does

1. **Creates the contracts table** with all necessary fields:
   - Basic contract information (number, subject, etc.)
   - Awardee details
   - Financial information
   - Dates and deadlines
   - Technical specifications
   - Status tracking

2. **Establishes the relationship** with markets table:
   - `market_id` field references `markets(id)`
   - Foreign key constraint ensures data integrity

3. **Adds performance optimizations**:
   - Indexes on frequently queried fields
   - Automatic timestamp updates

4. **Includes sample data** (in the complete version) for testing

## Table Structure

The contracts table includes these key fields:
- `id`: Unique identifier
- `market_id`: Reference to the related market
- `number`: Contract number
- `subject`: Contract description
- `awardee`: Company awarded the contract
- `initial_amount`: Contract value
- `start_date` & `deadline_date`: Timeline
- `status`: Contract status (draft, active, completed, etc.)

## After Running the Script

1. **Refresh your Supabase schema cache**:
   - Go to Settings > Database in Supabase
   - Click "Refresh schema cache"

2. **Test the Contrats page**:
   - Navigate to `/contrats` in your app
   - The error should be resolved
   - You should see the contracts dashboard

## Verification

After running the script, you can verify the setup by running:
```sql
-- Check if table exists
SELECT table_name FROM information_schema.tables WHERE table_name = 'contracts';

-- Check the relationship
SELECT 
    constraint_name, 
    table_name, 
    column_name, 
    foreign_table_name, 
    foreign_column_name
FROM information_schema.referential_constraints rc
JOIN information_schema.key_column_usage kcu ON rc.constraint_name = kcu.constraint_name
WHERE kcu.table_name = 'contracts';
```

## Troubleshooting

If you still get errors after running the script:

1. **Check Supabase logs** for any SQL errors
2. **Verify the markets table exists** and has the correct structure
3. **Refresh the schema cache** in Supabase settings
4. **Check browser console** for any JavaScript errors

## Next Steps

Once the contracts table is created:
1. You can add real contract data through your app
2. The relationship with markets will work properly
3. All CRUD operations on contracts will function correctly
4. The analytics and reporting features will display real data

## Files Created

- `create_contracts_table.sql` - Complete setup with sample data
- `create_contracts_table_simple.sql` - Basic table creation only
- `CONTRACTS_TABLE_FIX_README.md` - This documentation

Choose the appropriate script based on your needs and run it in your Supabase SQL Editor. 