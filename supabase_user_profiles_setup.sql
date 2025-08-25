-- Configuration de la table user_profiles pour Supabase
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase

-- 1. Créer la table user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'manager', 'agent')),
  full_name TEXT,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Activer RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Créer les politiques RLS
-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Les admins peuvent voir tous les profils
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Les admins peuvent modifier tous les profils
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Créer un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Insérer des utilisateurs de test (remplacez les UUID par vos vrais utilisateurs)
-- Pour trouver l'UUID de votre utilisateur, allez dans Authentication > Users dans Supabase
-- et copiez l'ID de votre utilisateur

-- Exemple d'insertion (décommentez et modifiez selon vos besoins) :
-- INSERT INTO user_profiles (user_id, role, full_name, department) VALUES 
--   ('VOTRE_UUID_ICI', 'admin', 'Votre Nom', 'IT'),
--   ('AUTRE_UUID_ICI', 'manager', 'Autre Nom', 'Finance');

-- 6. Créer une fonction pour obtenir le rôle d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM user_profiles 
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(user_role, 'agent');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Donner les permissions nécessaires
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO authenticated;

-- 8. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role); 