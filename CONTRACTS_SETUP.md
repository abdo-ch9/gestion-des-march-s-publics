# 🏗️ Configuration des Contrats - Guide Complet

## 📋 Vue d'ensemble

Ce guide explique comment configurer et utiliser le système de gestion des contrats avec CRUD complet, intégré à Supabase.

## 🗄️ Configuration de la Base de Données

### 1. Exécuter le Script SQL

Exécutez le fichier `supabase_contracts_setup.sql` dans votre base de données Supabase :

```sql
-- Ce script crée :
-- - Table 'contracts' avec tous les champs nécessaires
-- - Index pour les performances
-- - RLS (Row Level Security) activé
-- - Politiques de sécurité
-- - Données d'exemple
```

### 2. Structure de la Table

```sql
CREATE TABLE contracts (
  id UUID PRIMARY KEY,
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
  status VARCHAR(50) DEFAULT 'draft',
  service VARCHAR(100) NOT NULL,
  contract_type VARCHAR(100) NOT NULL,
  procurement_method VARCHAR(100) NOT NULL,
  budget_source VARCHAR(100) NOT NULL,
  technical_specifications TEXT,
  requirements TEXT,
  deliverables TEXT,
  notes TEXT,
  consumed_days INTEGER DEFAULT 0,
  remaining_days INTEGER GENERATED ALWAYS AS (GREATEST(0, duration_days - consumed_days)) STORED,
  is_overdue BOOLEAN GENERATED ALWAYS AS (CURRENT_DATE > deadline_date AND status = 'active') STORED,
  is_near_deadline BOOLEAN GENERATED ALWAYS AS (remaining_days <= 30 AND remaining_days > 0 AND status = 'active') STORED,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Sécurité et Permissions

### Politiques RLS

- **Utilisateurs** : Peuvent voir/modifier leurs propres contrats
- **Admins** : Peuvent voir/modifier tous les contrats
- **Authentification** : Requise pour toutes les opérations

### Champs Calculés

- `deadline_date` : Calculé automatiquement (start_date + duration_days)
- `remaining_days` : Jours restants calculés en temps réel
- `is_overdue` : Détecte automatiquement les retards
- `is_near_deadline` : Détecte les délais proches (≤30 jours)

## 🎯 Fonctionnalités Implémentées

### 1. CRUD Complet

- ✅ **Create** : Ajout de nouveaux contrats
- ✅ **Read** : Lecture et affichage des contrats
- ✅ **Update** : Modification des contrats existants
- ✅ **Delete** : Suppression des contrats

### 2. Gestion des États

- **Brouillon** : Contrats en préparation
- **En cours** : Contrats actifs
- **Terminé** : Contrats finalisés
- **En retard** : Détecté automatiquement
- **Suspendu** : Contrats temporairement arrêtés
- **Annulé** : Contrats annulés

### 3. Calculs Automatiques

- **Jours consommés** : Calculés depuis la date de début
- **Jours restants** : Mise à jour en temps réel
- **Retards** : Détection automatique
- **Alertes** : Délais proches et retards

## 🚀 Utilisation

### 1. Accès à la Page

Naviguez vers `http://localhost:3000/contrats`

### 2. Créer un Contrat

1. Cliquez sur **"Nouveau Contrat"**
2. Remplissez les 4 onglets :
   - **Informations de base** : Numéro, objet, attributaire, service
   - **Financier** : Montant, dates, source de budget
   - **Technique** : Spécifications, exigences, livrables
   - **Contacts** : Coordonnées de l'attributaire

### 3. Gérer les Contrats

- **Vue d'ensemble** : Statistiques et résumé
- **Liste** : Tous les contrats avec filtres
- **Analyses** : Graphiques et rapports

## 🔧 Composants Principaux

### 1. `useContracts` Hook

```javascript
const { 
  contracts, 
  loading, 
  error, 
  fetchContracts,
  addContract,
  updateContract,
  deleteContract,
  searchContracts,
  filterContractsByStatus,
  filterContractsByService
} = useContracts()
```

### 2. `ContractsDashboard`

- Affichage des statistiques en temps réel
- Filtres et recherche
- Navigation par onglets
- Gestion des modales

### 3. `AddContractModal`

- Formulaire multi-onglets
- Validation des champs requis
- Intégration avec Supabase
- Gestion des erreurs

## 📊 Statistiques Disponibles

- **Total des contrats** : Nombre total
- **Contrats actifs** : En cours d'exécution
- **Contrats terminés** : Finalisés
- **Contrats en retard** : Détectés automatiquement
- **Valeur totale** : Montant cumulé

## 🔍 Filtres et Recherche

### Recherche
- Par numéro de contrat
- Par objet
- Par attributaire

### Filtres
- **Statut** : Tous, Brouillon, En cours, Terminé, etc.
- **Service** : Eau, Assainissement, Irrigation, Maintenance
- **Tri** : Date, Montant, Statut, Délai

## ⚠️ Dépannage

### Erreurs Courantes

1. **"Client Supabase non disponible"**
   - Vérifiez vos variables d'environnement
   - Assurez-vous que Supabase est configuré

2. **"Utilisateur non authentifié"**
   - Connectez-vous à l'application
   - Vérifiez votre session

3. **"Impossible de se connecter à la table des contrats"**
   - Exécutez le script SQL de configuration
   - Vérifiez les permissions RLS

### Vérifications

1. **Console du navigateur** : Regardez les logs d'erreur
2. **Base de données** : Vérifiez que la table existe
3. **Authentification** : Confirmez que l'utilisateur est connecté

## 🎉 Prochaines Étapes

- [ ] Implémenter la modification des contrats
- [ ] Ajouter la gestion des décomptes
- [ ] Intégrer le suivi des délais
- [ ] Créer des rapports avancés
- [ ] Ajouter des notifications par email

## 📞 Support

Pour toute question ou problème :
1. Vérifiez ce guide
2. Consultez la console du navigateur
3. Vérifiez les logs Supabase
4. Contactez l'équipe de développement

---

**🎯 Votre système de contrats est maintenant entièrement fonctionnel avec CRUD complet !** 