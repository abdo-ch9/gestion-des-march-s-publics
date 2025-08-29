-- ========================================
-- SETUP USER PROFILES TABLE ONLY
-- ========================================
-- This script creates just the user_profiles table for user management
-- Run this in your Supabase SQL editor

-- Step 1: Drop existing table if it has wrong structure
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Step 2: Create the table with correct structure
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'manager', 'agent')),
    department VARCHAR(100),
    phone VARCHAR(50),
    organization VARCHAR(255) DEFAULT 'ORMVAO',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login TIMESTAMP WITH TIME ZONE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id)
);

-- Step 3: Create indexes for performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_department ON user_profiles(department);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

-- Step 4: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Insert sample users
INSERT INTO user_profiles (email, full_name, role, department, phone, status, last_login) VALUES
    ('ahmed.benali@ormvao.ma', 'Ahmed Benali', 'agent', 'Irrigation', '+212 6 12 34 56 78', 'active', '2024-01-15T10:30:00Z'),
    ('fatima.zahra@ormvao.ma', 'Fatima Zahra', 'manager', 'Formation', '+212 6 98 76 54 32', 'active', '2024-01-15T09:15:00Z'),
    ('mohammed.alami@ormvao.ma', 'Mohammed Alami', 'agent', 'Équipement', '+212 6 55 44 33 22', 'active', '2024-01-14T16:45:00Z'),
    ('amina.tazi@ormvao.ma', 'Amina Tazi', 'admin', 'Administration', '+212 6 11 22 33 44', 'active', '2024-01-15T08:00:00Z'),
    ('hassan.elfassi@ormvao.ma', 'Hassan El Fassi', 'agent', 'Infrastructure', '+212 6 99 88 77 66', 'inactive', '2024-01-10T14:20:00Z');

-- Step 6: Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can insert profiles
CREATE POLICY "Admins can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update profiles
CREATE POLICY "Admins can update profiles" ON user_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles" ON user_profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Step 8: Grant permissions
GRANT ALL ON user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 9: Verify the setup
SELECT 
    '✅ User Profiles Table Setup Complete!' as status,
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
    COUNT(CASE WHEN role = 'manager' THEN 1 END) as manager_users,
    COUNT(CASE WHEN role = 'agent' THEN 1 END) as agent_users,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
    COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_users
FROM user_profiles;

-- Step 10: Show the data to confirm
SELECT 
    full_name,
    email,
    role,
    department,
    status,
    last_login
FROM user_profiles
ORDER BY created_at; 