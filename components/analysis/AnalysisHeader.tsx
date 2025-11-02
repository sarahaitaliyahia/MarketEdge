import { X } from "lucide-react"

interface AnalysisHeaderProps {
  title: string
  summary: string
  sectors: string[]
  onNewAnalysis: () => void
  showNewAnalysisButton?: boolean
}

export function AnalysisHeader({ title, summary, sectors, onNewAnalysis, showNewAnalysisButton = true }: AnalysisHeaderProps) {
  return (
    <>
      {showNewAnalysisButton && (
        <button 
          onClick={onNewAnalysis} 
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all hover:gap-2"
        >
          <X className="h-4 w-4" /> New Analysis
        </button>
      )}

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-200 shadow-xl">
        <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
        <p className="text-foreground/70 mb-4 text-justify">{summary}</p>
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">Affected Sectors:</p>
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector, i) => (
              <span key={i} className="bg-white px-3 py-1 rounded text-sm text-foreground">
                {sector}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
