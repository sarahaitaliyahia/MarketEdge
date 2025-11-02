/**
 * Hook pour appeler le backend SageMaker et gérer les 3 étapes d'analyse
 */

import { useState } from "react"
import type { AnalysisResponse, AnalysisStep } from "@/lib/types"

interface UseBackendAnalysisState {
  isAnalyzing: boolean
  currentStep: AnalysisStep | null
  result: AnalysisResponse | null
  error: string | null
}

export function useBackendAnalysis() {
  const [state, setState] = useState<UseBackendAnalysisState>({
    isAnalyzing: false,
    currentStep: null,
    result: null,
    error: null,
  })

  const analyzeFile = async (file: File) => {
    setState({
      isAnalyzing: true,
      currentStep: 1,
      result: null,
      error: null,
    })

    try {
      const formData = new FormData()
      formData.append("file", file)

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const timeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 60000

      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL n'est pas configuré")
      }

      // Créer un AbortController pour le timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(`${backendUrl}/analyze`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data: AnalysisResponse = await response.json()

      setState({
        isAnalyzing: false,
        currentStep: null,
        result: data,
        error: null,
      })

      return data
    } catch (error: any) {
      const errorMessage =
        error.name === "AbortError"
          ? "L'analyse a pris trop de temps"
          : error.message || "Erreur lors de l'analyse"

      setState({
        isAnalyzing: false,
        currentStep: null,
        result: null,
        error: errorMessage,
      })

      throw error
    }
  }

  const reset = () => {
    setState({
      isAnalyzing: false,
      currentStep: null,
      result: null,
      error: null,
    })
  }

  return {
    ...state,
    analyzeFile,
    reset,
  }
}
