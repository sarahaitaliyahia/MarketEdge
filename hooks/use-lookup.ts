import { useState, useEffect } from "react"
import { LookupResponse } from "@/lib/types"

/**
 * Hook pour charger les données de décision (mock ou depuis API)
 * Pour le moment, charge depuis /decision.json
 */
export function useLookupData() {
  const [data, setData] = useState<LookupResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/decision.json")
        if (!response.ok) {
          throw new Error("Failed to load decision data")
        }
        const jsonData = await response.json()
        setData(jsonData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}
