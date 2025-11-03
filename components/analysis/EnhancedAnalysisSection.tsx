import { FileText, ChevronDown, ChevronUp } from "lucide-react"

interface EnhancedAnalysisSectionProps {
  enhancedData: any
  isOpen: boolean
  onToggle: () => void
}

export function EnhancedAnalysisSection({ enhancedData, isOpen, onToggle }: EnhancedAnalysisSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
      <div 
        className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 -m-6 p-6 rounded-lg transition-colors"
        onClick={onToggle}
      >
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold mb-1 ${enhancedData ? 'text-foreground' : 'text-foreground/40'}`}>
            Document Analysis
          </h4>
          <p className={`text-sm ${enhancedData ? 'text-foreground/60' : 'text-foreground/40'}`}>
            {enhancedData ? 'Key findings and potential risks from the document' : 'Loading enhanced data...'}
          </p>
        </div>
        <div className="text-gray-400">
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
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
  )
}
