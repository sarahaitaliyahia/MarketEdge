interface ConfidenceMetrics {
  model_confidence?: number
  data_completeness?: number
  legal_text_similarity?: number
  explanability_score?: number
}

interface KeyFindingsSectionProps {
  keyFindings?: string[]
  confidenceMetrics?: ConfidenceMetrics
  macroTags?: string[]
  microTags?: string[]
}

export default function KeyFindingsSection({
  keyFindings,
  confidenceMetrics,
  macroTags,
  microTags,
}: KeyFindingsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Key Findings */}
      {keyFindings && keyFindings.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-semibold text-foreground flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
              {keyFindings.length}
            </span>
            Key Findings
          </h5>
          <ul className="space-y-2">
            {keyFindings.map((finding: string, i: number) => (
              <li key={i} className="flex gap-2 text-sm text-foreground/80">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Confidence Metrics */}
      {confidenceMetrics && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-semibold text-foreground mb-3">Confidence Metrics</h5>
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
      
      {/* Macro Tags */}
      {macroTags && macroTags.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-semibold text-foreground">Macro Tags</h5>
          <div className="flex flex-wrap gap-2">
            {macroTags.map((tag: string, i: number) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Micro Tags */}
      {microTags && microTags.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-semibold text-foreground">Micro Tags</h5>
          <div className="flex flex-wrap gap-2">
            {microTags.slice(0, 10).map((tag: string, i: number) => (
              <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
            {microTags.length > 10 && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                +{microTags.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
