# Système de Gestion des Contrats - ORMVAO

## Vue d'ensemble

Le système de gestion des contrats permet aux utilisateurs de gérer efficacement tous leurs contrats, de suivre les délais et les décomptes financiers. Il offre une interface complète avec des fonctionnalités avancées de recherche, filtrage et visualisation.

## Fonctionnalités principales

### 🏠 Tableau de bord
- **Statistiques en temps réel** : Total des contrats, contrats actifs, terminés, en retard
- **Vue d'ensemble** : Résumé par service, statut et alertes
- **Navigation intuitive** : Accès rapide à toutes les fonctionnalités

### 📋 Gestion des contrats
- **Liste dynamique** : Affichage de tous les contrats avec colonnes configurables
- **Recherche avancée** : Par numéro, objet, attributaire
- **Filtres multiples** : Par statut, service, dates
- **Tri intelligent** : Par montant, dates, statut, délai

### 🔍 Actions sur les contrats
- **Voir détails** : Informations complètes, décomptes, délais
- **Modifier** : Mise à jour des informations (selon permissions)
- **Supprimer** : Suppression sécurisée (administrateurs uniquement)

### 💰 Suivi financier
- **Décomptes** : Ajout, modification et suivi des décomptes financiers
- **Validation** : Gestion des statuts (en attente, validé, rejeté)
- **Suivi des montants** : Progression vs montant initial

### ⏰ Gestion des délais
- **Délais initiaux** : Configuration des délais de base
- **Prolongations** : Gestion des extensions de délais
- **Suspensions** : Mise en pause des contrats si nécessaire
- **Alertes visuelles** : Contrats en retard ou proches de la date limite

### 📊 Visualisation et analyses
- **Graphiques de progression** : Décomptes et consommation des délais
- **Statistiques détaillées** : Répartition par service et statut
- **Suivi temporel** : Évolution des décomptes et délais

## Gestion des rôles

### 👷 Agent de suivi
- ✅ Consulter tous les contrats
- ✅ Ajouter/modifier les décomptes
- ✅ Gérer les délais et prolongations
- ✅ Voir les détails complets

### 👨‍💼 Responsable de service
- ✅ Toutes les fonctionnalités de l'agent
- ✅ Filtrage et supervision avancée
- ✅ Validation des étapes critiques
- ✅ Rapports et analyses

### 👑 Administrateur
- ✅ Accès complet (CRUD)
- ✅ Création de nouveaux contrats
- ✅ Suppression des contrats
- ✅ Configuration du système
- ✅ Gestion des utilisateurs

## Structure technique

### 📁 Composants créés
```
components/contrats/
├── contracts-dashboard.jsx      # Tableau de bord principal
├── contracts-list.jsx           # Liste des contrats avec actions
├── add-contract-modal.jsx       # Modal d'ajout de contrat
├── edit-contract-modal.jsx      # Modal de modification
├── contract-details.jsx         # Vue détaillée du contrat
├── add-settlement-modal.jsx     # Ajout de décompte
└── add-deadline-modal.jsx       # Ajout de délai
```

### 🪝 Hooks personnalisés
```
lib/hooks/
└── use-contracts.js             # Gestion des données et opérations
```

### 🗄️ Base de données
Tables Supabase utilisées :
- `contrats` : Informations principales des contrats
- `decomptes` : Décomptes financiers
- `delais` : Gestion des délais et prolongations
- `services` : Services de l'organisation
- `attributaires` : Entreprises attributaires
- `utilisateurs` : Gestion des utilisateurs

## Utilisation

### 1. Accès au système
- Naviguez vers `/contrats` dans l'application
- Assurez-vous d'être connecté avec les bonnes permissions

### 2. Consultation des contrats
- Utilisez la barre de recherche pour trouver rapidement un contrat
- Appliquez des filtres par statut ou service
- Triez les résultats selon vos besoins

### 3. Gestion des contrats
- **Ajouter** : Cliquez sur "Nouveau Contrat" (admin uniquement)
- **Modifier** : Utilisez l'icône d'édition sur chaque ligne
- **Voir détails** : Cliquez sur l'icône d'œil pour plus d'informations

### 4. Suivi financier
- Dans la vue détaillée, onglet "Décomptes"
- Ajoutez de nouveaux décomptes avec montant et description
- Suivez la progression financière

### 5. Gestion des délais
- Dans la vue détaillée, onglet "Délais"
- Ajoutez des prolongations ou suspensions
- Surveillez les alertes de délais proches

## Fonctionnalités avancées

### 🔍 Recherche intelligente
- Recherche en temps réel
- Filtrage multi-critères
- Tri dynamique des résultats

### 📱 Interface responsive
- Adaptation automatique aux écrans
- Navigation mobile optimisée
- Composants adaptatifs

### 🎨 Alertes visuelles
- **Rouge** : Contrats en retard
- **Orange** : Délais proches de l'expiration
- **Vert** : Contrats dans les délais
- **Bleu** : Statuts en attente

### 📊 Graphiques et statistiques
- Barres de progression pour les décomptes
- Visualisation de la consommation des délais
- Statistiques agrégées par service

## Configuration

### Variables d'environnement
Assurez-vous que votre fichier `.env.local` contient :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

### Base de données
Créez les tables nécessaires dans Supabase :
```sql
-- Table des contrats
CREATE TABLE contrats (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(50) UNIQUE NOT NULL,
  objet TEXT NOT NULL,
  attributaire VARCHAR(200) NOT NULL,
  montant_initial DECIMAL(15,2) NOT NULL,
  date_notification DATE NOT NULL,
  date_debut DATE NOT NULL,
  duree INTEGER NOT NULL,
  statut VARCHAR(50) DEFAULT 'active',
  service_id INTEGER REFERENCES services(id),
  description TEXT,
  specifications_techniques TEXT,
  conditions_paiement TEXT,
  clause_penale TEXT,
  contact_personne VARCHAR(200),
  contact_telephone VARCHAR(50),
  contact_email VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des décomptes
CREATE TABLE decomptes (
  id SERIAL PRIMARY KEY,
  contrat_id INTEGER REFERENCES contrats(id),
  numero VARCHAR(50) NOT NULL,
  montant DECIMAL(15,2) NOT NULL,
  description TEXT,
  date_validation DATE,
  statut VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des délais
CREATE TABLE delais (
  id SERIAL PRIMARY KEY,
  contrat_id INTEGER REFERENCES contrats(id),
  type VARCHAR(50) NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  raison TEXT,
  statut VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Développement

### Ajout de nouvelles fonctionnalités
1. Créez le composant dans `components/contrats/`
2. Ajoutez la logique métier dans `use-contracts.js`
3. Intégrez dans le tableau de bord principal
4. Testez avec différents rôles utilisateur

### Personnalisation des composants
- Modifiez les styles dans les composants
- Ajustez les permissions dans les modals
- Personnalisez les graphiques et statistiques

### Tests
- Testez toutes les fonctionnalités avec chaque rôle
- Vérifiez la responsivité sur mobile
- Validez les permissions et la sécurité

## Support et maintenance

### Logs et débogage
- Utilisez la console du navigateur pour les erreurs
- Vérifiez les logs Supabase pour les opérations de base de données
- Surveillez les performances des requêtes

### Mises à jour
- Maintenez les dépendances à jour
- Testez les nouvelles fonctionnalités en environnement de développement
- Sauvegardez la base de données avant les déploiements

## Conclusion

Le système de gestion des contrats offre une solution complète et professionnelle pour la gestion des contrats de l'ORMVAO. Avec ses fonctionnalités avancées, sa gestion des rôles et son interface intuitive, il améliore significativement l'efficacité opérationnelle et le suivi des projets.

---

**Développé avec** : Next.js 14, React, TailwindCSS, Supabase  
**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024 