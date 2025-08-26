# Configuration des Marchés Publics

Ce guide vous explique comment configurer la fonctionnalité des marchés publics dans votre application.

## 1. Configuration de la Base de Données

### Étape 1: Exécuter le script SQL
1. Connectez-vous à votre projet Supabase
2. Allez dans l'éditeur SQL
3. Exécutez le script `supabase_markets_setup.sql`

Ce script va créer :
- La table `markets` avec tous les champs nécessaires
- Les politiques de sécurité RLS (Row Level Security)
- Les index pour optimiser les performances
- Une vue `markets_with_creator` pour les informations utilisateur

### Étape 2: Vérifier la configuration
Après l'exécution du script, vous devriez voir :
- Une nouvelle table `markets` dans votre schéma public
- Des politiques RLS activées
- Des index créés

## 2. Structure de la Table

La table `markets` contient les champs suivants :

### Informations de Base
- `number` : Numéro unique du marché (ex: MP-2024-001)
- `object` : Description de l'objet du marché
- `service` : Service responsable (irrigation, formation, etc.)
- `contract_type` : Type de contrat (travaux, services, fournitures)
- `procurement_method` : Méthode de passation

### Informations Financières
- `estimated_amount` : Montant estimé du marché
- `budget_source` : Source du budget
- `currency` : Devise (MAD par défaut)

### Dates et Échéances
- `publication_date` : Date de publication
- `submission_deadline` : Date limite de soumission
- `expected_start_date` : Date de début prévue
- `expected_end_date` : Date de fin prévue

### Informations sur l'Attributaire
- `attributaire` : Nom de l'entreprise attributaire
- `attributaire_address` : Adresse de l'entreprise
- `attributaire_phone` : Téléphone
- `attributaire_email` : Email

### Détails Techniques
- `technical_specifications` : Spécifications techniques
- `requirements` : Exigences et conditions
- `deliverables` : Livrables attendus

### Informations Supplémentaires
- `notes` : Notes et observations
- `status` : Statut du marché (draft, published, in_progress, completed, cancelled)

### Métadonnées
- `created_by` : ID de l'utilisateur créateur
- `created_at` : Date de création
- `updated_at` : Date de dernière modification

## 3. Sécurité et Permissions

### Politiques RLS
- **Lecture** : Tous les utilisateurs authentifiés peuvent voir tous les marchés
- **Création** : Tous les utilisateurs authentifiés peuvent créer des marchés
- **Modification** : Les utilisateurs peuvent modifier leurs propres marchés, les admins peuvent modifier tous
- **Suppression** : Les utilisateurs peuvent supprimer leurs propres marchés, les admins peuvent supprimer tous

### Permissions
- `GRANT USAGE ON SCHEMA public TO authenticated`
- `GRANT ALL ON markets TO authenticated`

## 4. Utilisation de l'Application

### Créer un Nouveau Marché
1. Allez dans la section "Marchés"
2. Cliquez sur "Ajouter un Marché"
3. Remplissez les informations dans les différents onglets
4. Cliquez sur "Créer le Marché"

### Champs Obligatoires
- Numéro du marché
- Objet du marché
- Service responsable
- Type de contrat
- Méthode de passation

### Gestion des Marchés
- **Voir** : Cliquez sur l'icône œil pour voir les détails
- **Modifier** : Cliquez sur l'icône crayon (fonctionnalité en développement)
- **Supprimer** : Cliquez sur le bouton "Supprimer"

## 5. Fonctionnalités Disponibles

### ✅ Implémentées
- Création de nouveaux marchés
- Affichage de la liste des marchés
- Filtrage par statut et recherche
- Suppression de marchés
- Calcul automatique de la progression
- Gestion des erreurs et notifications

### 🚧 En Développement
- Modification des marchés existants
- Upload de documents
- Gestion des pièces jointes
- Workflow de validation

### 📋 Prévues
- Export des données
- Rapports et statistiques
- Notifications automatiques
- Intégration avec d'autres modules

## 6. Dépannage

### Erreur "Table markets does not exist"
- Vérifiez que le script SQL a été exécuté
- Vérifiez que vous êtes dans le bon projet Supabase

### Erreur "Permission denied"
- Vérifiez que les politiques RLS sont activées
- Vérifiez que l'utilisateur est authentifié
- Vérifiez que les permissions sont correctement accordées

### Marchés ne se chargent pas
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que Supabase est configuré dans vos variables d'environnement
- Vérifiez que l'utilisateur est connecté

## 7. Variables d'Environnement

Assurez-vous d'avoir configuré dans votre `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

## 8. Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de la console du navigateur
2. Vérifiez les logs de Supabase
3. Consultez la documentation Supabase
4. Contactez l'équipe de développement

---

**Note** : Cette fonctionnalité nécessite que l'authentification Supabase soit configurée et fonctionnelle. 