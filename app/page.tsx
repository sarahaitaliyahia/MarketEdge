"use client"

import type React from "react"

import { User, Plus, Upload, FileText, TrendingUp, PieChart, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AnalysisItem {
  id: string
  title: string
  description: string
  sentiment: "Bullish" | "Neutral" | "Bearish"
  timestamp: string
  color: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisItem | null>(null)
  const [recentAnalysis, setRecentAnalysis] = useState<AnalysisItem[]>([
    {
      id: "1",
      title: "Clean Energy Tax Credits Act",
      description: "Analyzed renewable energy sector impacts and identified key beneficiaries...",
      sentiment: "Bullish",
      timestamp: "2 hours ago",
      color: "green",
    },
    {
      id: "2",
      title: "Healthcare Reform Bill",
      description: "Mixed signals for pharmaceutical companies, potential regulatory changes...",
      sentiment: "Neutral",
      timestamp: "1 day ago",
      color: "yellow",
    },
    {
      id: "3",
      title: "Banking Regulation Update",
      description: "Stricter compliance requirements may impact regional banks...",
      sentiment: "Bearish",
      timestamp: "3 days ago",
      color: "red",
    },
  ])
  const [analysisResults, setAnalysisResults] = useState<{
    title: string
    summary: string
    sectors: string[]
    sentiment: "Bullish" | "Neutral" | "Bearish"
  } | null>(null)
  const [enhancedData, setEnhancedData] = useState<any>(null)
  const [isEnhancedOpen, setIsEnhancedOpen] = useState(true)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith('.html')) {
      setUploadedFile(file)
    } else if (file) {
      alert("Please upload a valid HTML file")
    }
  }
  const [showSidebar, setShowSidebar] = useState(true)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file && file.name.endsWith('.html')) {
      setUploadedFile(file)
    } else if (file) {
      alert("Please upload a valid HTML file")
    }
  }

  const handleStartAnalysis = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    setIsTransitioning(true)
    
    // Fade out delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    try {
      // Lire le contenu du fichier HTML
      let htmlContent = await uploadedFile.text()

      console.log("Original HTML content length:", htmlContent.length)

      // Nettoyer le HTML intelligemment pour réduire la taille
      // 1. Supprimer les scripts, styles, et commentaires (pas utiles pour l'analyse)
      htmlContent = htmlContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ') // Réduire les espaces multiples
        .trim()

      console.log("After cleaning, HTML length:", htmlContent.length)

      const MAX_LENGTH = 100000
      if (htmlContent.length > MAX_LENGTH) {
        console.log(`Truncating content from ${htmlContent.length} to ${MAX_LENGTH} characters`)
        htmlContent = htmlContent.substring(0, MAX_LENGTH)
      }

      console.log("Sending request to API...")
      console.log("Final HTML content length:", htmlContent.length)

      // Étape 1: Appeler /analyse pour obtenir l'analyse de base
      console.log("Step 1: Calling /analyse...")
      const analyseResponse = await fetch(
        "/api/analyse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            html_content: htmlContent,
          }),
        }
      )

      console.log("Analyse response status:", analyseResponse.status)

      if (!analyseResponse.ok) {
        const errorText = await analyseResponse.text()
        console.error("API error response:", errorText)
        throw new Error(`API error: ${analyseResponse.status} - ${errorText}`)
      }

      const analyseResult = await analyseResponse.json()
      console.log("Analyse result:", analyseResult)

      // Étape 2: Appeler /enhance pour enrichir les résultats (optionnel)
      console.log("Step 2: Calling /enhance...")
      let apiResult = analyseResult
      
      try {
        const enhanceResponse = await fetch(
          "/api/enhance",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              law_analysis_output: analyseResult.law_analysis_output,
            }),
          }
        )

        if (enhanceResponse.ok) {
          const enhanceResult = await enhanceResponse.json()
          console.log("Enhanced result:", enhanceResult)
          apiResult = enhanceResult
          // Stocker les données enrichies séparément
          setEnhancedData(enhanceResult)
        } else {
          const errorText = await enhanceResponse.text()
          console.warn("Enhancement failed, using base analysis:", errorText)
        }
      } catch (enhanceError) {
        console.warn("Enhancement endpoint not available, using base analysis:", enhanceError)
      }

      console.log("Final API result:", apiResult)

      // Extraire les données de law_analysis_output
      const lawAnalysis = apiResult.law_analysis_output || {}
      const lawMetadata = lawAnalysis.law_metadata || {}
      const impact = lawAnalysis.impact || {}
      const analysisNotes = lawAnalysis.analysis_notes || {}
      
      // Déterminer le sentiment basé sur les findings et risks
      const keyFindings = analysisNotes.key_findings || []
      const potentialRisks = analysisNotes.potential_risks || []
      let sentiment: "Bullish" | "Neutral" | "Bearish" = "Neutral"
      
      // Logique simple : plus de findings positifs = Bullish, plus de risques = Bearish
      if (keyFindings.length > potentialRisks.length * 1.5) {
        sentiment = "Bullish"
      } else if (potentialRisks.length > keyFindings.length * 1.5) {
        sentiment = "Bearish"
      }
      
      // Extraire les noms des secteurs depuis les objets {sector, impact}
      const sectorsArray = impact.sectors || []
      const sectorNames = sectorsArray.map((s: any) => 
        typeof s === 'string' ? s : s.sector || s.name || 'Unknown'
      )
      
      // Mapper la réponse de l'API vers le format attendu
      const result = {
        title: uploadedFile.name.replace(".html", ""),
        summary: lawMetadata.summary || analysisNotes.analyst_comments || "Analyse complétée avec succès.",
        sectors: sectorNames.length > 0 ? sectorNames : ["Technology", "Finance"],
        sentiment: sentiment,
      }
      
      console.log("Mapped result:", result)

      setAnalysisResults(result)
      
      // Small delay before showing results to ensure clean transition
      await new Promise((resolve) => setTimeout(resolve, 50))
      setIsTransitioning(false)

      // Add to recent analysis
      const newAnalysis: AnalysisItem = {
        id: Date.now().toString(),
        title: result.title,
        description: result.summary.substring(0, 50) + "...",
        sentiment: result.sentiment,
        timestamp: "Just now",
        color: result.sentiment === "Bullish" ? "green" : result.sentiment === "Neutral" ? "yellow" : "red",
      }

      setRecentAnalysis([newAnalysis, ...recentAnalysis])
    } catch (error) {
      console.error("Error during analysis:", error)
      
      // Message d'erreur plus détaillé
      let errorMessage = "Une erreur s'est produite lors de l'analyse."
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage = "Erreur de connexion à l'API. Vérifiez :\n1. Que l'API est accessible\n2. Les paramètres CORS de l'API\n3. Votre connexion internet"
      } else if (error instanceof Error) {
        errorMessage = `Erreur: ${error.message}`
      }
      
      alert(errorMessage)
      setIsTransitioning(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAddNew = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setUploadedFile(null)
      setAnalysisResults(null)
      setEnhancedData(null)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 700)
  }

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish":
        return "bg-green-100 text-green-700"
      case "Neutral":
        return "bg-yellow-100 text-yellow-700"
      case "Bearish":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 w-48">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold text-sm shadow-md">
              ME
            </div>
            <h1 className="text-xl font-semibold text-foreground">MarketEdge</h1>
          </div>

          <nav className="flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => setActiveTab("home")}
              className={`text-sm font-medium transition-all ${activeTab === "home" ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`text-sm font-medium transition-all ${activeTab === "reports" ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}
            >
              Reports
            </button>
          </nav>

          <div className="flex items-center gap-4 w-48 justify-end">
            <button className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 transition-all shadow-sm flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
          {activeTab === "reports" ? (
            <div className="animate-in fade-in duration-700">
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentAnalysis.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAnalysis(item)}
                    className="p-5 border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white/70 backdrop-blur-sm"
                  >
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-foreground/60 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground/50">{item.timestamp}</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getSentimentStyles(item.sentiment)}`}>
                        {item.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : analysisResults ? (
            <div className={`max-w-4xl mx-auto transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <button onClick={handleAddNew} className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all hover:gap-2">
                <X className="h-4 w-4" /> New Analysis
              </button>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-200 shadow-xl">
                <h2 className="text-3xl font-bold text-foreground mb-4">{analysisResults.title}</h2>
                <p className="text-foreground/70 mb-4 text-justify">{analysisResults.summary}</p>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Affected Sectors:</p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.sectors.map((sector, i) => (
                      <span key={i} className="bg-white px-3 py-1 rounded text-sm text-foreground">
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Key Provisions - Affiche les données enrichies */}
                <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
                  <div 
                    className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-gray-50 -m-6 p-6 rounded-lg transition-colors"
                    onClick={() => setIsEnhancedOpen(!isEnhancedOpen)}
                  >
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Key Findings & Analysis</h4>
                      <p className="text-sm text-foreground/60">
                        {enhancedData ? 'Comprehensive insights from AI analysis' : 'Loading enhanced data...'}
                      </p>
                    </div>
                    <div className="text-gray-400">
                      {isEnhancedOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isEnhancedOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {enhancedData && enhancedData.law_analysis_output && (
                      <div className="mt-4 space-y-6">
                      {/* Key Findings */}
                      {enhancedData.law_analysis_output.analysis_notes?.key_findings && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-foreground flex items-center gap-2">
                            <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                              {enhancedData.law_analysis_output.analysis_notes.key_findings.length}
                            </span>
                            Key Findings
                          </h5>
                          <ul className="space-y-2">
                            {enhancedData.law_analysis_output.analysis_notes.key_findings.map((finding: string, i: number) => (
                              <li key={i} className="flex gap-2 text-sm text-foreground/80">
                                <span className="text-blue-600 font-bold mt-0.5">•</span>
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Potential Risks */}
                      {enhancedData.law_analysis_output.analysis_notes?.potential_risks && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-foreground flex items-center gap-2">
                            <span className="h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                              {enhancedData.law_analysis_output.analysis_notes.potential_risks.length}
                            </span>
                            Potential Risks
                          </h5>
                          <ul className="space-y-2">
                            {enhancedData.law_analysis_output.analysis_notes.potential_risks.map((risk: string, i: number) => (
                              <li key={i} className="flex gap-2 text-sm text-foreground/80">
                                <span className="text-red-600 font-bold mt-0.5">⚠</span>
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Analyst Comments */}
                      {enhancedData.law_analysis_output.analysis_notes?.analyst_comments && (
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                          <h5 className="font-semibold text-indigo-900 mb-2">Analyst Commentary</h5>
                          <p className="text-sm text-indigo-800 leading-relaxed">
                            {enhancedData.law_analysis_output.analysis_notes.analyst_comments}
                          </p>
                        </div>
                      )}
                      
                      {/* Confidence Metrics */}
                      {enhancedData.law_analysis_output.confidence_metrics && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-foreground mb-3">Confidence Metrics</h5>
                          <div className="grid grid-cols-2 gap-3">
                            {enhancedData.law_analysis_output.confidence_metrics.model_confidence && (
                              <div>
                                <p className="text-xs text-foreground/60 mb-1">Model Confidence</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-blue-600 rounded-full transition-all"
                                      style={{ width: `${enhancedData.law_analysis_output.confidence_metrics.model_confidence * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-foreground">
                                    {Math.round(enhancedData.law_analysis_output.confidence_metrics.model_confidence * 100)}%
                                  </span>
                                </div>
                              </div>
                            )}
                            {enhancedData.law_analysis_output.confidence_metrics.data_completeness && (
                              <div>
                                <p className="text-xs text-foreground/60 mb-1">Data Completeness</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-green-600 rounded-full transition-all"
                                      style={{ width: `${enhancedData.law_analysis_output.confidence_metrics.data_completeness * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-foreground">
                                    {Math.round(enhancedData.law_analysis_output.confidence_metrics.data_completeness * 100)}%
                                  </span>
                                </div>
                              </div>
                            )}
                            {enhancedData.law_analysis_output.confidence_metrics.legal_text_similarity && (
                              <div>
                                <p className="text-xs text-foreground/60 mb-1">Legal Text Similarity</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-purple-600 rounded-full transition-all"
                                      style={{ width: `${enhancedData.law_analysis_output.confidence_metrics.legal_text_similarity * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-foreground">
                                    {Math.round(enhancedData.law_analysis_output.confidence_metrics.legal_text_similarity * 100)}%
                                  </span>
                                </div>
                              </div>
                            )}
                            {enhancedData.law_analysis_output.confidence_metrics.explanability_score && (
                              <div>
                                <p className="text-xs text-foreground/60 mb-1">Explainability Score</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-orange-600 rounded-full transition-all"
                                      style={{ width: `${enhancedData.law_analysis_output.confidence_metrics.explanability_score * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-foreground">
                                    {Math.round(enhancedData.law_analysis_output.confidence_metrics.explanability_score * 100)}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Impact Tags */}
                      {enhancedData.law_analysis_output.impact?.related_tags_macro && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-foreground">Macro Tags</h5>
                          <div className="flex flex-wrap gap-2">
                            {enhancedData.law_analysis_output.impact.related_tags_macro.map((tag: string, i: number) => (
                              <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {enhancedData.law_analysis_output.impact?.related_tags_micro && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-foreground">Micro Tags</h5>
                          <div className="flex flex-wrap gap-2">
                            {enhancedData.law_analysis_output.impact.related_tags_micro.slice(0, 10).map((tag: string, i: number) => (
                              <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                                {tag}
                              </span>
                            ))}
                            {enhancedData.law_analysis_output.impact.related_tags_micro.length > 10 && (
                              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                                +{enhancedData.law_analysis_output.impact.related_tags_micro.length - 10} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    )}
                  </div>
                </div>

                {/* Market Impact */}
                <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Market Impact</h4>
                      <p className="text-sm text-foreground/60">Moderate to high impact</p>
                    </div>
                  </div>
                </div>

                {/* Risk Level - Third */}
                <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <PieChart className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Risk Level</h4>
                      <p className="text-sm text-foreground/60">Medium risk assessment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={`mb-8 transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <div className="mb-6 mt-0">
                  <h2 className="text-3xl font-bold text-center text-foreground mb-2">Analyze New Law Proposal</h2>
                  <p className="text-center text-foreground/60">
                    Upload the HTML file of a law proposal to get AI-powered market impact analysis
                  </p>
                </div>

                {/* AI Analysis Pipeline */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6 text-center">AI Analysis Pipeline</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-4xl mx-auto">
                    <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100/50">
                      <div className="flex justify-center mb-3">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-md">
                          <FileText className="h-7 w-7 text-blue-600" />
                        </div>
                      </div>
                      <h4 className="font-semibold text-base text-foreground mb-2 flex items-center justify-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          1
                        </span>
                        Law Summarization
                      </h4>
                      <p className="text-sm text-foreground/60">Extract key elements and identify affected sectors</p>
                    </div>

                    <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100/50">
                      <div className="flex justify-center mb-3">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-md">
                          <TrendingUp className="h-7 w-7 text-green-600" />
                        </div>
                      </div>
                      <h4 className="font-semibold text-base text-foreground mb-2 flex items-center justify-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          2
                        </span>
                        Financial Context
                      </h4>
                      <p className="text-sm text-foreground/60">Cross-reference with SEC filings and corporate data</p>
                    </div>

                    <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100/50">
                      <div className="flex justify-center mb-3">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-md">
                          <PieChart className="h-7 w-7 text-purple-600" />
                        </div>
                      </div>
                      <h4 className="font-semibold text-base text-foreground mb-2 flex items-center justify-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          3
                        </span>
                        Investment Insights
                      </h4>
                      <p className="text-sm text-foreground/60">
                        Generate portfolio recommendations and risk assessment
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 max-w-xl mx-auto bg-white/50 backdrop-blur-sm shadow-sm"
                >
                  <input type="file" accept=".html" onChange={handleFileUpload} className="hidden" id="file-input" />
                  <label htmlFor="file-input" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-md">
                        <Upload className="h-7 w-7 text-blue-600" />
                      </div>
                      <p className="text-foreground font-medium">
                        Drop your HTML file here or{" "}
                        <span className="text-blue-600 hover:text-blue-700 font-semibold">browse</span>
                      </p>
                      {uploadedFile && (
                        <div className="flex items-center gap-3 mt-2 px-4 py-2 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-600 font-medium">{uploadedFile.name}</p>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              setUploadedFile(null)
                              const input = document.getElementById('file-input') as HTMLInputElement
                              if (input) input.value = ''
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Remove file"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-center mt-3 mb-8">
                <Button
                  onClick={handleStartAnalysis}
                  disabled={!uploadedFile || isAnalyzing}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                </Button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Analysis Detail Overlay */}
      {selectedAnalysis && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedAnalysis(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{selectedAnalysis.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getSentimentStyles(selectedAnalysis.sentiment)}`}>
                      {selectedAnalysis.sentiment}
                    </span>
                    <span className="text-sm text-foreground/60">{selectedAnalysis.timestamp}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Summary */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Summary</h3>
                <p className="text-foreground/70">{selectedAnalysis.description}</p>
              </div>

              {/* Analysis Sections */}
              <div className="space-y-4">
                {/* Key Provisions */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-foreground text-lg">Key Provisions</h4>
                  </div>
                  <div className="space-y-3 text-sm text-foreground/80">
                    <p className="font-medium">Major Provisions Identified:</p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>Tax credit adjustments for renewable energy investments up to 30%</li>
                      <li>Compliance requirements for emissions reporting (quarterly basis)</li>
                      <li>Infrastructure funding allocation ($50B over 5 years)</li>
                      <li>New regulatory framework for carbon offset trading</li>
                      <li>Incentives for domestic manufacturing in clean tech sector</li>
                    </ul>
                    <p className="pt-2"><span className="font-medium">Effective Date:</span> Q1 2026</p>
                    <p><span className="font-medium">Affected Industries:</span> Energy, Manufacturing, Transportation, Construction</p>
                  </div>
                </div>

                {/* Market Impact */}
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-foreground text-lg">Market Impact</h4>
                  </div>
                  <div className="space-y-3 text-sm text-foreground/80">
                    <p className="font-medium">Expected Market Effects:</p>
                    <div className="space-y-2">
                      <p><span className="font-medium text-green-700">Positive Impact:</span> Renewable energy companies, battery manufacturers, EV sector expected to see 15-25% growth in stock valuations</p>
                      <p><span className="font-medium text-yellow-700">Neutral Impact:</span> Traditional utilities with diversified portfolios may experience mixed results</p>
                      <p><span className="font-medium text-red-700">Negative Impact:</span> Fossil fuel companies and coal mining operations likely to face headwinds</p>
                    </div>
                    <p className="pt-2"><span className="font-medium">Trading Volume:</span> Expect increased volatility in energy sector (30-40% above average)</p>
                    <p><span className="font-medium">Institutional Response:</span> Major funds rebalancing towards ESG-compliant portfolios</p>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <PieChart className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-foreground text-lg">Risk Assessment</h4>
                  </div>
                  <div className="space-y-3 text-sm text-foreground/80">
                    <p className="font-medium">Risk Analysis Summary:</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-white/60 p-3 rounded-lg">
                        <p className="font-medium text-purple-700">Overall Risk</p>
                        <p className="text-lg font-bold">Medium</p>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg">
                        <p className="font-medium text-purple-700">Volatility Index</p>
                        <p className="text-lg font-bold">6.5/10</p>
                      </div>
                    </div>
                    <p className="font-medium">Key Risk Factors:</p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>Implementation timeline uncertainty (6-12 month window)</li>
                      <li>Political opposition may delay or modify provisions</li>
                      <li>Technology readiness concerns in certain sectors</li>
                      <li>Supply chain constraints for clean energy components</li>
                    </ul>
                    <p className="pt-2"><span className="font-medium">Recommendation:</span> Monitor legislative progress closely, consider hedging strategies for exposed positions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
