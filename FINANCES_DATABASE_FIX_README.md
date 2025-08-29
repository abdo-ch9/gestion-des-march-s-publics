# Fix pour l'erreur de la page Finances

## Problème
Erreur: `column markets_1.title does not exist` lors de l'accès à la page finances.

## Cause du problème
L'erreur est causée par plusieurs problèmes dans la structure de base de données :

1. **Colonnes manquantes dans la table `markets`** : Le code essaie d'accéder à la colonne `title` qui n'existe pas. Les vraies colonnes sont `number` et `object`.

2. **Colonnes manquantes dans la table `contracts`** : Le système de finances a besoin de colonnes pour gérer les paiements (`payment_status`, `partial_amount`, `remaining_amount`, `deadline_date`).

3. **Tables manquantes** : Les tables `settlements` et `expenses` peuvent ne pas exister.

## Solution

### Étape 1: Exécuter le script de correction complet
Exécutez le fichier SQL suivant dans votre base de données Supabase :
```bash
fix_finances_database_complete.sql
```

Ce script va :
- ✅ Ajouter les colonnes manquantes à la table `contracts`
- ✅ Créer la table `settlements` pour les décomptes
- ✅ Créer la table `expenses` pour les dépenses
- ✅ Créer les index pour de meilleures performances
- ✅ Initialiser les données existantes
- ✅ Ajouter des données d'exemple pour les tests

### Étape 2: Vérifier les corrections apportées
Le code a été corrigé pour utiliser les bonnes colonnes :

**Avant (incorrect):**
```javascript
markets (
  id,
  title,        // ❌ N'existe pas
  description,  // ❌ N'existe pas
  budget,       // ❌ N'existe pas
  currency,
  status
)
```

**Après (correct):**
```javascript
markets (
  id,
  number,           // ✅ Correct
  object,           // ✅ Correct
  estimated_amount, // ✅ Correct
  currency,
  status
)
```

## Fonctionnalités ajoutées

### Table `contracts` - Nouvelles colonnes :
- `payment_status` : Statut de paiement (pending, partial, paid, overdue, cancelled)
- `partial_amount` : Montant partiel payé
- `remaining_amount` : Montant restant à payer
- `deadline_date` : Date limite de paiement

### Table `settlements` (nouvelle) :
- Gestion des décomptes et paiements des contrats
- Suivi des périodes de travaux
- Statuts de vérification et approbation

### Table `expenses` (nouvelle) :
- Gestion des dépenses manuelles
- Catégories : matériaux, maintenance, personnel, services, autres
- Suivi des fournisseurs et factures

## Résultat attendu

Après l'exécution du script, la page finances devrait :

1. ✅ Se charger sans erreur
2. ✅ Afficher les statistiques financières
3. ✅ Montrer les contrats avec leurs marges bénéficiaires
4. ✅ Permettre la gestion des dépenses manuelles
5. ✅ Suivre les statuts de paiement des contrats
6. ✅ Générer des graphiques et analyses

## Vérification post-installation

Pour vérifier que tout fonctionne :

1. Accédez à la page Finances
2. Vérifiez que les KPI s'affichent correctement
3. Testez l'ajout d'une nouvelle dépense
4. Vérifiez les différents onglets (Vue d'ensemble, Revenus, Dépenses, etc.)

## Structure finale de la base de données

```
markets
├── id (UUID)
├── number (VARCHAR) ✅ Utilisé par le code
├── object (TEXT) ✅ Utilisé par le code  
├── estimated_amount (DECIMAL) ✅ Utilisé par le code
├── currency (VARCHAR)
├── status (VARCHAR)
└── ... autres colonnes

contracts
├── id (UUID)
├── market_id (UUID) → markets.id
├── payment_status (VARCHAR) ✅ Nouveau
├── partial_amount (DECIMAL) ✅ Nouveau
├── remaining_amount (DECIMAL) ✅ Nouveau
├── deadline_date (DATE) ✅ Nouveau
└── ... autres colonnes

settlements ✅ Nouvelle table
├── id (UUID)
├── contract_id (UUID) → contracts.id
├── amount (DECIMAL)
├── status (VARCHAR)
└── ... autres colonnes

expenses ✅ Nouvelle table
├── id (UUID)
├── description (TEXT)
├── amount (DECIMAL)
├── category (VARCHAR)
└── ... autres colonnes
```

## En cas de problème

Si l'erreur persiste :

1. Vérifiez que le script SQL s'est exécuté sans erreur
2. Vérifiez que les tables existent dans Supabase
3. Vérifiez les permissions RLS (Row Level Security)
4. Redémarrez l'application Next.js

## Fichiers modifiés

- ✅ `lib/hooks/use-finances.js` - Correction des noms de colonnes
- ✅ `fix_finances_database_complete.sql` - Script de correction complet
- ✅ Création de tables manquantes avec données d'exemple 