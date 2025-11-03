"use client"

import { useState } from "react"
import { X, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

interface Company {
  ticker: string
  position: number
  confidence_level: number
  reasoning: string
  regulatory_hook?: string
  business_impact?: string
}

interface ConfidenceMetrics {
  model_confidence?: number
  data_completeness?: number
  legal_text_similarity?: number
  explanability_score?: number
}

interface DecisionAnalysisProps {
  decisionData?: {
    analysis?: {
      ai_synthesis?: {
        summary?: string
        recommendations?: string
      }
    }
  }
  companies?: Company[]
  confidenceMetrics?: ConfidenceMetrics
}

export default function DecisionAnalysis({ decisionData, companies, confidenceMetrics }: DecisionAnalysisProps) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const ai_synthesis = decisionData?.analysis?.ai_synthesis
  
  console.log('[DecisionAnalysis] Decision data:', decisionData)
  console.log('[DecisionAnalysis] ai_synthesis:', ai_synthesis)
  console.log('[DecisionAnalysis] Companies for heatmap:', companies)

  if (!ai_synthesis && !companies) return null

  // Color mapping based on position (-1 to 1)
  const getColor = (position: number): string => {
    if (position >= 0.6) return "#16a34a" // green-600
    if (position >= 0.3) return "#22c55e" // green-500
    if (position >= 0.1) return "#86efac" // green-300
    if (position >= -0.1) return "#fde047" // yellow-300
    if (position >= -0.3) return "#fb923c" // orange-400
    if (position >= -0.6) return "#f87171" // red-400
    return "#dc2626" // red-600
  }

  const getSentiment = (position: number): { label: string; icon: React.ReactNode; color: string } => {
    if (position >= 0.3) {
      return {
        label: "Bullish",
        icon: <TrendingUp className="h-4 w-4" />,
        color: "text-green-600",
      }
    } else if (position <= -0.3) {
      return {
        label: "Bearish",
        icon: <TrendingDown className="h-4 w-4" />,
        color: "text-red-600",
      }
    } else {
      return {
        label: "Neutral",
        icon: <AlertCircle className="h-4 w-4" />,
        color: "text-yellow-600",
      }
    }
  }

  // Use summary for Strategic Summary (filtering success messages)
  const strategicSummary = ai_synthesis?.summary
    ?.split('\n')
    .filter(line => !line.includes('générée avec succès') && !line.includes('generated successfully'))
    .join('\n')
    .trim()

  // Use recommendations for Investment Recommendations (filter the header line)
  const recommendations = ai_synthesis?.recommendations
    ?.split('\n')
    .filter(line => !line.includes("Résumé et interprétation des résultats d'analyse du S&P500"))
    .join('\n')
    .trim()

  return (
    <div className="space-y-6">
      {/* Strategic Summary - Full text */}
      {strategicSummary && (
        <div className="space-y-3">
          <h5 className="font-semibold text-foreground">Strategic Summary</h5>
          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {strategicSummary}
            </p>
          </div>
        </div>
      )}

      {/* Investment Recommendations - Split into sections with blue sidebar */}
      {recommendations && (
        <div className="space-y-3">
          <h5 className="font-semibold text-foreground">Investment Recommendations</h5>
          <div className="space-y-4">
            {(() => {
              // Split by double newlines to get paragraphs/sections
              const sections = recommendations.split(/\n\n+/).filter(s => s.trim())
              
              return sections.map((section, idx) => (
                <div 
                  key={`rec-${idx}`}
                  className="bg-white border-l-4 border-blue-600 p-4 rounded shadow-sm"
                >
                  <div className="text-sm text-gray-900 leading-relaxed whitespace-pre-line">
                    {section.trim()}
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>
      )}

      {/* Company Position Heat Map - TradingView Style */}
      {companies && companies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-semibold text-foreground">S&P 500 Position Heatmap</h5>
            <div className="text-xs text-foreground/60">
              {companies.length} companies analyzed
            </div>
          </div>

          {/* TradingView-style Heatmap Grid */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-1 shadow-xl">
            <div className="grid gap-[1px]" style={{ 
              gridTemplateColumns: `repeat(auto-fit, minmax(80px, 1fr))`,
            }}>
              {[...companies].sort((a, b) => b.position - a.position).map((company) => {
                const positionPercent = (company.position * 100).toFixed(1)
                const isPositive = company.position >= 0
                
                return (
                  <button
                    key={company.ticker}
                    type="button"
                    onClick={() => setSelectedCompany(company)}
                    className="relative group cursor-pointer p-0 overflow-hidden transition-all duration-200 hover:scale-105 hover:z-10 hover:shadow-2xl aspect-square"
                    style={{ backgroundColor: getColor(company.position) }}
                  >
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                      {/* Ticker */}
                      <div className="font-bold text-sm text-white drop-shadow-lg mb-1">
                        {company.ticker}
                      </div>
                      
                      {/* Position with arrow */}
                      <div className="flex items-center gap-1">
                        <span className="text-white/90 text-xs font-semibold">
                          {isPositive ? '▲' : '▼'}
                        </span>
                        <span className="text-white/90 text-xs font-bold">
                          {isPositive ? '+' : ''}{positionPercent}%
                        </span>
                      </div>

                      {/* Confidence indicator - small bar at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                        <div 
                          className="h-full bg-white/50"
                          style={{ width: `${company.confidence_level * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>

                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-2xl z-20 pointer-events-none border border-gray-700">
                      <div className="font-bold text-sm mb-1">{company.ticker}</div>
                      <div className="text-white/90">Position: {isPositive ? '+' : ''}{positionPercent}%</div>
                      <div className="text-white/90">Confidence: {(company.confidence_level * 100).toFixed(0)}%</div>
                      <div className="text-white/70 text-[10px] mt-1">Click for details</div>
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color Legend - TradingView style */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground/70">Bearish</span>
                <div className="flex gap-0.5">
                  <div className="w-8 h-5 rounded-sm border border-gray-300" style={{ backgroundColor: "#dc2626" }}></div>
                  <div className="w-8 h-5 rounded-sm border border-gray-300" style={{ backgroundColor: "#f87171" }}></div>
                  <div className="w-8 h-5 rounded-sm border border-gray-300" style={{ backgroundColor: "#fb923c" }}></div>
                  <div className="w-8 h-5 rounded-sm border border-gray-300" style={{ backgroundColor: "#fde047" }}></div>
                  <div className="w-8 h-5 rounded-sm border border-gray-300" style={{ backgroundColor: "#86efac" }}></div>
                  <div className="w-8 h-5 rounded-sm border border-gray-300" style={{ backgroundColor: "#22c55e" }}></div>
                  <div className="w-8 h-5 rounded-sm border border-gray-300" style={{ backgroundColor: "#16a34a" }}></div>
                </div>
                <span className="text-xs font-medium text-foreground/70">Bullish</span>
              </div>
              <div className="text-[10px] text-foreground/50">
                Bottom bar = Confidence level
              </div>
            </div>
          </div>

          {/* Company Detail Modal */}
          {selectedCompany && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
              onClick={() => setSelectedCompany(null)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-br from-blue-50 to-blue-100/50 border-b border-blue-200 p-6 rounded-t-2xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-foreground">{selectedCompany.ticker}</h2>
                        <div className={`${getSentiment(selectedCompany.position).color} bg-white/80 px-3 py-1 rounded-full border flex items-center gap-1`}>
                          {getSentiment(selectedCompany.position).icon}
                          <span className="font-semibold text-sm">{getSentiment(selectedCompany.position).label}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCompany(null)}
                      className="h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
                      type="button"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Position */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Predicted Position
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/70">Market Position:</span>
                        <span className="font-bold text-xl">{(selectedCompany.position * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${((selectedCompany.position + 1) / 2) * 100}%`,
                            backgroundColor: getColor(selectedCompany.position),
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-foreground/60">
                        <span>-100% (Bearish)</span>
                        <span>0% (Neutral)</span>
                        <span>+100% (Bullish)</span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-xl border border-purple-200">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-purple-600" />
                      Confidence Level
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/70">Model Confidence:</span>
                        <span className="font-bold text-xl">{(selectedCompany.confidence_level * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-purple-600 transition-all duration-500"
                          style={{ width: `${selectedCompany.confidence_level * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Reasoning */}
                  {selectedCompany.reasoning && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-xl border border-green-200">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Analysis Reasoning</h3>
                      <p className="text-foreground/80 leading-relaxed text-sm">{selectedCompany.reasoning}</p>
                    </div>
                  )}

                  {/* Regulatory Hook */}
                  {selectedCompany.regulatory_hook && (
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-5 rounded-xl border border-orange-200">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Regulatory Impact</h3>
                      <p className="text-foreground/80 leading-relaxed text-sm">{selectedCompany.regulatory_hook}</p>
                    </div>
                  )}

                  {/* Business Impact */}
                  {selectedCompany.business_impact && (
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-5 rounded-xl border border-indigo-200">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Business Impact</h3>
                      <p className="text-foreground/80 leading-relaxed text-sm">{selectedCompany.business_impact}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Company Analysis Summary */}
      {companies && companies.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-semibold text-foreground">Company Analysis Overview</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {companies.slice(0, 6).map((company) => (
              <div key={company.ticker} className="border border-border rounded-lg p-3 bg-white hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">{company.ticker}</span>
                  <span className={`text-sm font-bold ${
                    company.position >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {company.position >= 0 ? '+' : ''}{(company.position * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-foreground/70 line-clamp-2">
                  {company.reasoning}
                </p>
              </div>
            ))}
          </div>
          {companies.length > 6 && (
            <p className="text-xs text-foreground/60 text-center">
              +{companies.length - 6} more companies analyzed
            </p>
          )}
        </div>
      )}

      {/* Confidence Metrics */}
      {confidenceMetrics && (
        <div className="space-y-3 mt-6 pt-6 border-t border-border">
          <h5 className="font-semibold text-foreground">Analysis Confidence Metrics</h5>
          <div className="grid grid-cols-2 gap-3">
            {confidenceMetrics.model_confidence !== undefined && (
              <div>
                <p className="text-xs text-foreground/60 mb-1">Model Confidence</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${confidenceMetrics.model_confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(confidenceMetrics.model_confidence * 100)}%
                  </span>
                </div>
              </div>
            )}
            {confidenceMetrics.data_completeness !== undefined && (
              <div>
                <p className="text-xs text-foreground/60 mb-1">Data Completeness</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full transition-all"
                      style={{ width: `${confidenceMetrics.data_completeness * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(confidenceMetrics.data_completeness * 100)}%
                  </span>
                </div>
              </div>
            )}
            {confidenceMetrics.legal_text_similarity !== undefined && (
              <div>
                <p className="text-xs text-foreground/60 mb-1">Legal Text Similarity</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full transition-all"
                      style={{ width: `${confidenceMetrics.legal_text_similarity * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(confidenceMetrics.legal_text_similarity * 100)}%
                  </span>
                </div>
              </div>
            )}
            {confidenceMetrics.explanability_score !== undefined && (
              <div>
                <p className="text-xs text-foreground/60 mb-1">Explainability Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-600 rounded-full transition-all"
                      style={{ width: `${confidenceMetrics.explanability_score * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(confidenceMetrics.explanability_score * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
