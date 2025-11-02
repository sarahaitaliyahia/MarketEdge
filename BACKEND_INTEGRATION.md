# Connexion au Backend SageMaker

## Configuration

1. Créez un fichier `.env.local` à la racine du projet :
```bash
cp .env.example .env.local
```

2. Remplissez l'URL de votre backend SageMaker :
```env
NEXT_PUBLIC_BACKEND_URL=https://votre-endpoint.amazonaws.com
NEXT_PUBLIC_API_TIMEOUT=60000
```

## Utilisation dans le Frontend

Le hook `useBackendAnalysis` est prêt à être utilisé pour envoyer les fichiers HTML au backend.

### Exemple d'utilisation :

```tsx
import { useBackendAnalysis } from "@/lib/hooks/use-backend-analysis"

function YourComponent() {
  const { isAnalyzing, currentStep, result, error, analyzeFile, reset } = useBackendAnalysis()

  const handleAnalyze = async (file: File) => {
    try {
      const data = await analyzeFile(file)
      console.log("Résultat:", data)
    } catch (err) {
      console.error("Erreur:", err)
    }
  }

  return (
    <div>
      {isAnalyzing && <p>Analyse en cours... Étape {currentStep}</p>}
      {result && <div>Analyse terminée!</div>}
      {error && <div>Erreur: {error}</div>}
    </div>
  )
}
```

## Format de Réponse Attendu du Backend

Le backend doit retourner une réponse au format suivant :

```typescript
{
  success: boolean,
  data: {
    // Étape 1: Law Summarization
    step1: {
      title: string,
      summary: string,
      sectors: string[],
      sentiment: "Bullish" | "Neutral" | "Bearish",
      keyProvisions?: string[]
    },
    
    // Étape 2: Financial Context
    step2: {
      marketImpact: string,
      affectedCompanies?: string[],
      financialData?: any
    },
    
    // Étape 3: Investment Insights
    step3: {
      recommendations: string[],
      riskLevel: "High" | "Medium" | "Low",
      investmentOpportunities?: string[]
    }
  },
  metadata?: {
    processingTime: number,
    timestamp: string
  },
  error?: string
}
```

## Types TypeScript

Tous les types sont définis dans `/lib/types/backend.types.ts` et sont prêts à être utilisés.

## Structure Prête

✅ Types TypeScript définis (`/lib/types/backend.types.ts`)
✅ Hook personnalisé créé (`/lib/hooks/use-backend-analysis.ts`)
✅ React Query configuré (`/components/query-provider.tsx`)
✅ Variables d'environnement définies (`.env.example`)

Le frontend est maintenant prêt à recevoir les données de votre backend SageMaker ! 🚀
