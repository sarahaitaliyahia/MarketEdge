"use client"

import type React from "react"

import { User, Plus, Upload, FileText, TrendingUp, PieChart, X, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAnalysis } from "@/hooks/use-analysis"
import { useLookupData } from "@/hooks/use-lookup"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import GeographicImpact from "@/components/analysis/GeographicImpact"
import SectorImpact from "@/components/analysis/SectorImpact"
import KeyFindingsSection from "@/components/analysis/KeyFindingsSection"
import PotentialRisks from "@/components/analysis/PotentialRisks"
import AnalystCommentary from "@/components/analysis/AnalystCommentary"
import AnalysisChatbox from "@/components/analysis/AnalysisChatbox"
import CompanyHeatMap from "@/components/analysis/CompanyHeatMap"
import { PDFExportButton } from "@/components/analysis/PDFExportButton"

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
  const [isEnhancedOpen, setIsEnhancedOpen] = useState(true)
  const [isMarketImpactOpen, setIsMarketImpactOpen] = useState(false)
  const [isRiskLevelOpen, setIsRiskLevelOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Use the analysis hook
  const {
    uploadedFile,
    setUploadedFile,
    isAnalyzing,
    analysisResults,
    enhancedData,
    handleStartAnalysis: hookHandleStartAnalysis,
    resetAnalysis,
  } = useAnalysis()

  // Use the lookup hook for heat map data
  const { data: lookupData, isLoading: isLoadingLookup } = useLookupData()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validExtensions = ['.html', '.txt', '.xml', '.pdf']
      const fileExtension = '.' + file.name.toLowerCase().split('.').pop()
      
      if (validExtensions.includes(fileExtension)) {
        setUploadedFile(file)
      } else {
        alert("Please browse for a valid document file (HTML, TXT, XML, or PDF)")
      }
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
    if (file) {
      const validExtensions = ['.html', '.txt', '.xml', '.pdf']
      const fileExtension = '.' + file.name.toLowerCase().split('.').pop()
      
      if (validExtensions.includes(fileExtension)) {
        setUploadedFile(file)
      } else {
        alert("Please browse for a valid document file (HTML, TXT, XML, or PDF)")
      }
    }
  }

  const handleStartAnalysis = async () => {
    setIsTransitioning(true)
    await hookHandleStartAnalysis()
    
    // Add to recent analysis if successful
    if (analysisResults) {
      const newAnalysis: AnalysisItem = {
        id: Date.now().toString(),
        title: analysisResults.title,
        description: analysisResults.summary.substring(0, 100) + "...",
        sentiment: analysisResults.sentiment,
        timestamp: "Just now",
        color: analysisResults.sentiment === "Bullish" ? "green" : analysisResults.sentiment === "Neutral" ? "yellow" : "red",
      }
      setRecentAnalysis([newAnalysis, ...recentAnalysis])
    }
    
    setIsTransitioning(false)
  }

  const handleAddNew = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      resetAnalysis()
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 overflow-x-hidden w-full relative">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 w-48">
            <img 
              src="/logo.svg" 
              alt="MarketEdge Logo" 
              className="h-8 w-8 shadow-md"
            />
            <h1 className="text-xl font-semibold text-foreground">MarketEdge</h1>
          </div>

          <nav className="flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => setActiveTab("home")}
              className={`text-sm font-medium transition-all ${activeTab === "home" ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}
            >
              Analysis Workspace
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`text-sm font-medium transition-all ${activeTab === "reports" ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}
            >
              Analysis History
            </button>
          </nav>

          <div className="flex items-center gap-4 w-48 justify-end">
            <button className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 transition-all shadow-sm flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex overflow-x-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Main Content */}
        <main 
          className={`flex-1 px-4 py-8 w-full overflow-y-auto overflow-x-hidden transition-all duration-300 ${
            isChatOpen && analysisResults ? 'mr-[350px]' : ''
          }`}
          style={{ maxWidth: isChatOpen && analysisResults ? 'calc(100% - 350px)' : '100%' }}
        >
          <div className="max-w-[1900px] mx-auto">
          {activeTab === "reports" ? (
            <div className="animate-in fade-in duration-700">
              <h2 className="text-2xl font-bold text-foreground mb-6">Analysis Archive</h2>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : analysisResults ? (
            <div className={`max-w-4xl mx-auto transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <button onClick={handleAddNew} className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all hover:gap-2">
                <X className="h-4 w-4" /> ← New Analysis Session
              </button>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="mb-4">
                  <h2 className="text-3xl font-bold text-foreground">{analysisResults.title}</h2>
                </div>
                <p className="text-foreground/70 mb-6 text-justify leading-relaxed">{analysisResults.summary}</p>
              </div>

              <div className="space-y-6 xl:space-y-8">
                {/* Legislative Analysis Summary */}
                <div className={`bg-white p-6 rounded-lg border border-border shadow-sm ${enhancedData ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700' : ''}`}>
                  <div 
                    className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 -m-6 p-6 rounded-lg transition-colors"
                    onClick={() => setIsEnhancedOpen(!isEnhancedOpen)}
                  >
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Legislative Analysis Summary</h4>
                      <p className="text-sm text-foreground/60">
                        {enhancedData ? 'Parsed provisions, impact metrics, and confidence indicators' : 'Loading enhanced data...'}
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
                      <div className="mt-4">
                        <KeyFindingsSection 
                          keyFindings={enhancedData.law_analysis_output.analysis_notes?.key_findings}
                          confidenceMetrics={enhancedData.law_analysis_output.confidence_metrics}
                          macroTags={enhancedData.law_analysis_output.impact?.related_tags_macro}
                          microTags={enhancedData.law_analysis_output.impact?.related_tags_micro}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Cross-Sectoral Impact Assessment */}
                <div className={`bg-white p-6 rounded-lg border border-border shadow-sm ${enhancedData ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-1000' : ''}`}>
                  <div 
                    className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 -m-6 p-6 rounded-lg transition-colors"
                    onClick={() => setIsMarketImpactOpen(!isMarketImpactOpen)}
                  >
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Cross-Sectoral Impact Assessment</h4>
                      <p className="text-sm text-foreground/60">
                        {enhancedData ? 'Sector exposure quantification, risk vectors, and geographic impact distribution' : 'Loading data...'}
                      </p>
                    </div>
                    <div className="text-gray-400">
                      {isMarketImpactOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isMarketImpactOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {enhancedData && enhancedData.law_analysis_output && (
                      <div className="mt-4 space-y-6">
                        {/* Sector Exposure Heatmap */}
                        {enhancedData.law_analysis_output.impact?.sectors && (
                          <SectorImpact sectors={enhancedData.law_analysis_output.impact.sectors} />
                        )}
                        
                        {/* Regulatory & Compliance Risk Factors */}
                        {enhancedData.law_analysis_output.analysis_notes?.potential_risks && (
                          <PotentialRisks risks={enhancedData.law_analysis_output.analysis_notes.potential_risks} />
                        )}
                        
                        {/* Synthesized Analysis Notes */}
                        {enhancedData.law_analysis_output.analysis_notes?.analyst_comments && (
                          <AnalystCommentary commentary={enhancedData.law_analysis_output.analysis_notes.analyst_comments} />
                        )}
                        
                        {/* Geographic Impact */}
                        {enhancedData.law_analysis_output.impact?.countries_affected && (
                          <div>
                            <h5 className="font-semibold text-foreground mb-3">Geographic Impact</h5>
                            <GeographicImpact countries={enhancedData.law_analysis_output.impact.countries_affected} />
                          </div>
                        )}
                        
                        {/* Company Heat Map */}
                        {lookupData?.companies && lookupData.companies.length > 0 && (
                          <div className="mt-6">
                            <CompanyHeatMap companies={lookupData.companies} />
                          </div>
                        )}
                        
                        {/* PDF Export Button */}
                        {lookupData && (
                          <div className="mt-6 flex justify-center">
                            <PDFExportButton 
                              data={lookupData} 
                              lawTitle={analysisResults?.title}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className={`bg-white p-6 rounded-lg border border-border shadow-sm ${enhancedData ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-1300' : ''}`}>
                  <div 
                    className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 -m-6 p-6 rounded-lg transition-colors"
                    onClick={() => setIsRiskLevelOpen(!isRiskLevelOpen)}
                  >
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <PieChart className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Risk Assessment</h4>
                      <p className="text-sm text-foreground/60">
                        Overall risk level and key risk factors
                      </p>
                    </div>
                    <div className="text-gray-400">
                      {isRiskLevelOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isRiskLevelOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="mt-4">
                      <p className="text-center text-foreground/40 italic py-8">
                        Risk assessment data will be available soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Loading Animation - Full Screen Overlay */}
              {isAnalyzing ? (
                <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 z-40 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
                  <div className="w-32 h-32">
                    <DotLottieReact
                      src="https://lottie.host/c73eb50c-d4a0-485e-b47f-291de4dfc108/oo1ZtgwTSB.lottie"
                      loop
                      autoplay
                    />
                  </div>
                  <p className="text-sm text-foreground/60 font-medium">Executing analysis pipeline • Estimated time: 2-3 min</p>
                </div>
              ) : (
                <div className={`mb-8 transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  <div className="mb-6 mt-0">
                    <h2 className="text-3xl font-bold text-center text-foreground mb-2">Legislative Document Analysis Pipeline</h2>
                    <p className="text-center text-foreground/60">
                      Ingest legislative documents for cross-sectoral impact assessment and portfolio exposure modeling
                    </p>
                  </div>

                  {/* Multi-Stage Processing Framework */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6 text-center">Multi-Stage Processing Framework</h3>

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
                        Legislative Parsing
                      </h4>
                      <p className="text-sm text-foreground/60">Parse statutory text & extract sector-specific provisions</p>
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
                        Data Enrichment
                      </h4>
                      <p className="text-sm text-foreground/60">Merge legislative dataset with SEC disclosure filings and corporate fundamentals</p>
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
                        Portfolio Impact Scoring
                      </h4>
                      <p className="text-sm text-foreground/60">
                        Calculate position-level exposure vectors and risk indicators
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 max-w-xl mx-auto bg-white/50 backdrop-blur-sm shadow-sm"
                >
                  <input type="file" accept=".html,.txt,.xml,.pdf" onChange={handleFileUpload} className="hidden" id="file-input" />
                  <label htmlFor="file-input" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-3">
                      {!uploadedFile && (
                        <>
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-md">
                            <Upload className="h-7 w-7 text-blue-600" />
                          </div>
                          <p className="text-foreground font-medium">
                            Drag legislative file or{" "}
                            <span className="text-blue-600 hover:text-blue-700 font-semibold">browse</span>
                          </p>
                          <p className="text-xs text-foreground/50">
                            Accepted formats: HTML, TXT, XML, PDF (congressional/regulatory sources)
                          </p>
                        </>
                      )}
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

                <div className="flex justify-center mt-6 mb-8">
                  <Button
                    onClick={handleStartAnalysis}
                    disabled={!uploadedFile}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Run Analysis Pipeline
                  </Button>
                </div>
              </div>
              )}
            </>
          )}
          </div>
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

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Chat Button - Only show when session_id is available */}
      {analysisResults && enhancedData?.session_id && !selectedAnalysis && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed top-1/2 right-0 -translate-y-1/2 z-40 py-6 px-3 bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:px-4 flex flex-col items-center justify-center gap-3 rounded-l-xl group"
          aria-label="Open Financial Assistant"
        >
          <MessageSquare className="h-7 w-7 group-hover:scale-110 transition-transform" />
          <span className="text-[13px] font-semibold tracking-wide" style={{ writingMode: 'vertical-rl', letterSpacing: '0.05em' }}>
            FINANCIAL ASSISTANT
          </span>
        </button>
      )}

      {/* Chat Component - Only available when session_id is available */}
      {analysisResults && enhancedData?.session_id && !selectedAnalysis && (
        <AnalysisChatbox
          sessionId={enhancedData.session_id}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  )
}
