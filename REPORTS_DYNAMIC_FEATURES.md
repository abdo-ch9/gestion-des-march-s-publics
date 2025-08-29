# Rapports Dynamiques - Fonctionnalités

## Vue d'ensemble

La page des rapports a été transformée pour être entièrement dynamique, se connectant en temps réel à votre base de données Supabase pour afficher des statistiques et métriques actualisées.

## Nouvelles Fonctionnalités

### 1. Données en Temps Réel
- **Statistiques des Contrats** : Total, valeur, taux de réussite, temps moyen
- **Statistiques des Marchés** : Nombre total de marchés
- **Statistiques Financières** : Dépenses, revenus, bénéfice net
- **Métriques de Performance** : Calculées automatiquement basées sur vos données

### 2. Générateur de Rapports Avancé
- **Types de Rapports** : Résumé général, contrats, marchés, financier, performance
- **Filtres Avancés** :
  - Période (date de début et fin)
  - Statut (brouillon, en attente, actif, terminé, annulé)
  - Service (construction, maintenance, consultation, fournitures, autre)
- **Options d'Export** : JSON et CSV

### 3. Interface Utilisateur Améliorée
- **Skeleton Loading** : Affichage de chargement élégant pendant la récupération des données
- **Gestion d'Erreurs** : Messages d'erreur clairs avec possibilité de réessayer
- **Actualisation des Données** : Bouton pour rafraîchir les données manuellement
- **Notifications Toast** : Retour utilisateur pour toutes les actions

## Architecture Technique

### Hook useReports
```javascript
const { 
  stats, 
  performanceMetrics, 
  loading, 
  error, 
  refreshData,
  generateCustomReport,
  exportReport
} = useReports()
```

### Calculs Automatiques
- **Taux de Réussite** : (Contrats terminés / Total contrats) × 100
- **Efficacité Budgétaire** : ((Budget total - Dépenses) / Budget total) × 100
- **Temps de Traitement** : Moyenne des jours consommés pour les contrats actifs
- **Satisfaction Client** : Score simulé basé sur le taux de réussite

### Sources de Données
- **Table `contracts`** : Informations sur les contrats et leurs statuts
- **Table `markets`** : Détails des marchés publics
- **Table `settlements`** : Paiements et règlements
- **Table `expenses`** : Dépenses et coûts

## Utilisation

### Génération de Rapport
1. Cliquez sur "Générer un Rapport"
2. Sélectionnez le type de rapport
3. Appliquez des filtres (dates, statut, service)
4. Cliquez sur "Générer le Rapport"

### Export de Données
1. Configurez les filtres dans le générateur
2. Sélectionnez le format d'export (JSON ou CSV)
3. Cliquez sur "Exporter"

### Actualisation des Données
- Utilisez le bouton "Actualiser" pour rafraîchir les données
- Les données se chargent automatiquement au chargement de la page

## Personnalisation

### Ajout de Nouvelles Métriques
Modifiez la fonction `calculatePerformanceMetrics` dans `use-reports.js` :

```javascript
// Exemple d'ajout d'une nouvelle métrique
{
  category: "Nouvelle Catégorie",
  metric: "Nouvelle Métrique",
  value: calculateNewMetric(data),
  target: 100,
  trend: "up",
  color: "text-green-600",
  unit: "%"
}
```

### Modification des Objectifs
Ajustez les valeurs cibles dans `calculatePerformanceMetrics` :

```javascript
const successRateTarget = 95 // Au lieu de 90
const budgetEfficiencyTarget = 90 // Au lieu de 85
```

## Dépendances

- **date-fns** : Gestion des dates et localisation française
- **lucide-react** : Icônes pour l'interface
- **@radix-ui** : Composants d'interface utilisateur
- **Supabase** : Base de données et authentification

## Support

Pour toute question ou problème avec les rapports dynamiques, vérifiez :
1. La connexion à Supabase
2. L'existence des tables requises
3. Les permissions d'accès aux données
4. La console du navigateur pour les erreurs JavaScript 