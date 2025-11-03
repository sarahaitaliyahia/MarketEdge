/**
 * Types pour les données du backend SageMaker
 * Le backend prend un fichier HTML et retourne l'analyse en 3 étapes
 */

export type SentimentType = "Bullish" | "Neutral" | "Bearish"

/**
 * Les 3 étapes de l'analyse
 */
export type AnalysisStep = 1 | 2 | 3

export interface AnalysisStepStatus {
  step: AnalysisStep
  status: "pending" | "in-progress" | "completed" | "error"
  data?: any
}

/**
 * Requête envoyée au backend
 */
export interface AnalysisRequest {
  htmlFile: File
}

/**
 * Réponse complète du backend après les 3 étapes
 */
export interface AnalysisResponse {
  success: boolean
  data: {
    // Étape 1: Law Summarization
    step1: {
      title: string
      summary: string
      sectors: string[]
      sentiment: SentimentType
      keyProvisions?: string[]
    }
    
    // Étape 2: Financial Context
    step2: {
      marketImpact: string
      affectedCompanies?: string[]
      financialData?: any
    }
    
    // Étape 3: Investment Insights
    step3: {
      recommendations: string[]
      riskLevel: "High" | "Medium" | "Low"
      investmentOpportunities?: string[]
    }
  }
  metadata?: {
    processingTime: number
    timestamp: string
  }
  error?: string
}

/**
 * Pour le streaming progressif des 3 étapes (si supporté)
 */
export interface StreamingAnalysisUpdate {
  currentStep: AnalysisStep
  stepStatus: "in-progress" | "completed"
  stepData?: any
}

/**
 * Types pour la fonctionnalité PDF Export (Decision Analysis)
 */
export interface CompanyDecision {
  ticker: string
  position: number
  reasoning: string
  confidence_level: number
  regulatory_hook?: string
  business_impact?: string
}

export interface AISynthesis {
  summary: string
  recommendations: string
  metadata: {
    model_used: string
    prompt_mode?: string
    language?: string
    execution_time_seconds?: number
    analysis_date?: string
    analyst?: string
    document_version?: string
  }
}

export interface LookupResponse {
  companies: CompanyDecision[]
  ai_synthesis: AISynthesis
}
