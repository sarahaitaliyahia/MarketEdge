import { useState } from 'react'

interface AnalysisResults {
  title: string
  summary: string
  sectors: string[]
  sentiment: 'Bullish' | 'Neutral' | 'Bearish'
}

interface EnhancedData {
  law_analysis_output?: {
    law_metadata?: {
      summary?: string
      jurisdiction?: string
    }
    analysis_notes?: {
      key_findings?: string[]
      potential_risks?: string[]
      analyst_comments?: string
    }
    confidence_metrics?: {
      model_confidence?: number
      data_completeness?: number
      legal_text_similarity?: number
      explanability_score?: number
    }
    impact?: {
      sectors?: Array<{
        sector: string
        impact: number
      }>
      countries_affected?: Array<{
        country: string
        impact: number
        direction: 'positive' | 'negative' | 'neutral'
      }>
      related_tags_macro?: string[]
      related_tags_micro?: string[]
    }
  }
}

export function useAnalysis() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)
  const [enhancedData, setEnhancedData] = useState<EnhancedData | null>(null)

  const getDocumentType = (file: File): string => {
    const extension = file.name.toLowerCase().split('.').pop()
    const supportedTypes: { [key: string]: string } = {
      'txt': 'txt',
      'html': 'html',
      'xml': 'xml',
      'pdf': 'pdf'
    }
    return supportedTypes[extension || ''] || 'txt'
  }

  const pollAnalysisStatus = async (jobId: string, maxWaitSeconds = 600): Promise<any> => {
    if (!jobId) {
      throw new Error('Job ID is required')
    }
    
    const pollInterval = 5000 // 5 seconds
    const startTime = Date.now()
    
    while ((Date.now() - startTime) < maxWaitSeconds * 1000) {
      try {
        const statusResponse = await fetch(`/api/status/${jobId}`)
        
        if (statusResponse.status === 200) {
          // Job completed
          return await statusResponse.json()
        } else if (statusResponse.status === 202) {
          // Still processing
          const statusData = await statusResponse.json()
          console.log(`Job ${jobId} status: ${statusData.status}`)
          
          // Wait before polling again
          const waitTime = statusData.poll_again_in_seconds 
            ? statusData.poll_again_in_seconds * 1000 
            : pollInterval
          await new Promise(resolve => setTimeout(resolve, waitTime))
        } else if (statusResponse.status === 400) {
          // Job failed
          const errorData = await statusResponse.json()
          throw new Error(`Analysis failed: ${errorData.error}`)
        } else if (statusResponse.status === 404) {
          throw new Error(`Job not found: ${jobId}`)
        } else {
          console.warn(`Unexpected status code: ${statusResponse.status}`)
          await new Promise(resolve => setTimeout(resolve, pollInterval))
        }
      } catch (error) {
        console.error('Polling error:', error)
        throw error
      }
    }
    
    throw new Error('Analysis timeout - job did not complete in time')
  }

  const handleStartAnalysis = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    
    try {
      const documentType = getDocumentType(uploadedFile)
      let documentContent: string

      if (documentType === 'pdf') {
        // For PDFs, encode as base64
        const arrayBuffer = await uploadedFile.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('')
        documentContent = btoa(binary)
      } else {
        // For text-based files, read as text
        const text = await uploadedFile.text()
        // Basic cleaning: remove script and style tags
        documentContent = text
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        
        // Limit size to avoid overwhelming the API
        const maxLength = 100000
        if (documentContent.length > maxLength) {
          documentContent = documentContent.substring(0, maxLength)
        }
      }

      // Call the analyse endpoint (returns job_id)
      const analyseResponse = await fetch('/api/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_type: documentType,
          document_content: documentContent,
        }),
      })

      if (!analyseResponse.ok) {
        const errorText = await analyseResponse.text()
        throw new Error(`Analysis submission failed: ${analyseResponse.status} ${errorText}`)
      }

      const analyseData = await analyseResponse.json()
      console.log('API Response:', JSON.stringify(analyseData, null, 2))
      
      // Check if we got a job_id (async response) or direct result (sync response)
      if (analyseData.job_id && typeof analyseData.job_id === 'string' && analyseData.job_id.length > 0) {
        // Async response with job_id - poll for results
        const jobId = analyseData.job_id
        console.log(`Analysis job submitted: ${jobId}`)
        
        // Start polling in background and update UI progressively
        pollAnalysisStatus(jobId).then(result => {
          console.log('Polling result:', JSON.stringify(result, null, 2))
          
          // Extract the actual analysis data from the nested result structure
          const analysisData = result.result || result
          const lawOutput = analysisData.law_analysis_output
          
          // STEP 1: Show basic info immediately (title + summary)
          if (lawOutput?.law_metadata) {
            setAnalysisResults({
              title: lawOutput.law_metadata.jurisdiction || 'Law Analysis',
              summary: lawOutput.law_metadata.summary || 'No summary available',
              sectors: [],
              sentiment: 'Neutral',
            })
            setIsAnalyzing(false) // Stop loading animation
          }
          
          // STEP 2: Add sectors and sentiment (simulate progressive loading)
          setTimeout(() => {
            const sectors = lawOutput?.impact?.sectors?.map((s: any) => s.sector) || []
            let sentiment: 'Bullish' | 'Neutral' | 'Bearish' = 'Neutral'
            if (lawOutput?.impact?.sectors) {
              const avgImpact = lawOutput.impact.sectors.reduce((sum: number, s: any) => sum + (s.impact || 0), 0) / lawOutput.impact.sectors.length
              sentiment = avgImpact > 0.1 ? 'Bullish' : avgImpact < -0.1 ? 'Bearish' : 'Neutral'
            }
            
            setAnalysisResults(prev => prev ? {
              ...prev,
              sectors: sectors,
              sentiment: sentiment,
            } : null)
          }, 300)
          
          // STEP 3: Load enhanced data (Key Findings, Risks, etc.)
          setTimeout(() => {
            if (lawOutput) {
              setEnhancedData({ law_analysis_output: lawOutput })
            }
          }, 600)
        }).catch(error => {
          console.error('Polling error:', error)
          alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
          setIsAnalyzing(false)
        })
        
        // Don't set isAnalyzing to false here - it will be done progressively
      } else {
        // Sync response with direct result
        console.log('Analysis completed synchronously')
        
        setAnalysisResults({
          title: analyseData.law_title || 'Untitled Document',
          summary: analyseData.summary || 'No summary available',
          sectors: analyseData.affected_sectors || [],
          sentiment: analyseData.sentiment || 'Neutral',
        })

        // Store enhanced data if available
        if (analyseData.law_analysis_output) {
          setEnhancedData(analyseData)
        }
        
        setIsAnalyzing(false)
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert(`Failed to analyze document: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setUploadedFile(null)
    setAnalysisResults(null)
    setEnhancedData(null)
    setIsAnalyzing(false)
  }

  return {
    uploadedFile,
    setUploadedFile,
    isAnalyzing,
    analysisResults,
    enhancedData,
    handleStartAnalysis,
    resetAnalysis,
  }
}
