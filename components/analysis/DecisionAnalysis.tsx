"use client"

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
  const ai_synthesis = decisionData?.analysis?.ai_synthesis
  
  console.log('[DecisionAnalysis] Decision data:', decisionData)
  console.log('[DecisionAnalysis] ai_synthesis:', ai_synthesis)

  if (!ai_synthesis && !companies) return null

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
                  key={idx}
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
