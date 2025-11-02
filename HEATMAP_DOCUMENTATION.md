# Company Heat Map - Documentation

## Vue d'ensemble

Le heat map interactif affiche les positions prédites des entreprises basées sur l'analyse de marché. Il permet aux utilisateurs de visualiser rapidement quelles entreprises sont les plus susceptibles d'être impactées positivement (bullish) ou négativement (bearish) par une proposition de loi.

## Fonctionnalités

### 1. Visualisation Heat Map
- **Grille colorée** : Chaque entreprise est représentée par une tuile colorée
- **Échelle de couleurs** : Du rouge (bearish) au vert (bullish)
  - Rouge foncé : Position très bearish (-0.6 à -1.0)
  - Rouge clair : Position bearish (-0.3 à -0.6)
  - Orange : Position légèrement bearish (-0.1 à -0.3)
  - Jaune : Position neutre (-0.1 à 0.1)
  - Vert clair : Position légèrement bullish (0.1 à 0.3)
  - Vert moyen : Position bullish (0.3 à 0.6)
  - Vert foncé : Position très bullish (0.6 à 1.0)

### 2. Niveau de Confiance
- Visualisé par l'opacité de la tuile
- Plus l'opacité est élevée, plus le niveau de confiance est élevé
- Aide à identifier les prédictions les plus fiables

### 3. Modal Interactif
Cliquer sur une entreprise ouvre un modal détaillé avec :

#### Position Prédite
- Score numérique de -1 à 1
- Barre de progression visuelle
- Sentiment (Bullish/Neutral/Bearish)

#### Niveau de Confiance
- Pourcentage de confiance du modèle (0-100%)
- Barre de progression
- Interprétation textuelle :
  - ≥70% : "High confidence - Strong signal strength"
  - ≥50% : "Medium confidence - Moderate signal strength"
  - <50% : "Lower confidence - Consider additional research"

#### Raisonnement
- Explication détaillée de la prédiction
- Facteurs clés influençant la position
- Contexte de marché spécifique

## Structure des Données

### Format de Réponse API (`/api/lookup`)

```typescript
interface LookupResponse {
  companies: CompanyData[]
  ai_synthesis: AISynthesis
}

interface CompanyData {
  Ticker: string              // Code boursier (ex: "AAPL", "TSLA")
  PredictedPosition: number   // -1 (bearish) à 1 (bullish)
  reasoning: string           // Explication de la prédiction
  confidence_level: number    // 0 à 1 (confiance du modèle)
}

interface AISynthesis {
  summary: string
  recommendations: string
  metadata: {
    model_used: string
    prompt_mode: string
    language: string
    execution_time_seconds: number
  }
}
```

### Exemple de Données

```json
{
  "companies": [
    {
      "Ticker": "NVDA",
      "PredictedPosition": 0.89,
      "reasoning": "Dominant position in AI chip market, continued data center growth...",
      "confidence_level": 0.73
    },
    {
      "Ticker": "XOM",
      "PredictedPosition": -0.22,
      "reasoning": "Energy transition policies expected to impact long-term profitability...",
      "confidence_level": 0.58
    }
  ]
}
```

## Intégration

### Emplacement
Le heat map est affiché à la fin de la section "Market Impact Analysis", après :
- Sector Impact Analysis
- Potential Risks
- Analyst Commentary
- Impacted Countries

### Hook Personnalisé
```typescript
import { useLookupData } from "@/hooks/use-lookup"

const { data, isLoading, error, refetch } = useLookupData()
```

- `data` : Données de lookup (entreprises + synthèse AI)
- `isLoading` : État de chargement
- `error` : Message d'erreur éventuel
- `refetch` : Fonction pour recharger les données

### Utilisation du Composant
```tsx
import CompanyHeatMap from "@/components/analysis/CompanyHeatMap"

{lookupData?.companies && lookupData.companies.length > 0 && (
  <CompanyHeatMap companies={lookupData.companies} />
)}
```

## API Backend

### Endpoint actuel (Mock)
`GET /api/lookup`

Retourne actuellement des données mockées pour le développement.

### Migration vers le Backend Réel

Quand le backend sera prêt, modifier `/app/api/lookup/route.ts` :

```typescript
export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_LOOKUP_URL || 'http://backend-service/lookup'
    const response = await fetch(backendUrl)
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching lookup data:", error)
    return NextResponse.json(
      { error: "Failed to fetch lookup data" },
      { status: 500 }
    )
  }
}
```

### Variables d'Environnement

Ajouter à `.env.local` :
```
BACKEND_LOOKUP_URL=https://your-backend-api.com/lookup
```

## Accessibilité

Le composant suit les meilleures pratiques d'accessibilité :
- Support du clavier (navigation, Escape pour fermer)
- Attributs ARIA appropriés
- Rôles sémantiques (dialog, modal)
- Contraste de couleurs conforme WCAG

## Responsive Design

- **Mobile** : Grille 2 colonnes
- **Tablet** : Grille 3-4 colonnes
- **Desktop** : Grille 5 colonnes
- Modal adaptatif avec scroll

## Performance

- Chargement automatique au montage de la page
- Mise en cache des données via React hooks
- Fallback sur données mockées en cas d'erreur API
- Animations optimisées avec CSS

## Tests Recommandés

1. **Test de chargement** : Vérifier que les données se chargent correctement
2. **Test d'interaction** : Cliquer sur différentes entreprises
3. **Test de responsive** : Tester sur différentes tailles d'écran
4. **Test d'erreur** : Simuler une erreur API
5. **Test de performance** : Avec un grand nombre d'entreprises (50+)

## Améliorations Futures

- Filtrage par secteur
- Tri par confiance ou position
- Export des données en CSV
- Graphiques comparatifs
- Historique des prédictions
- Intégration avec les données temps réel
