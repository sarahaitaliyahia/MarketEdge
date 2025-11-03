"use client"

interface Company {
  ticker: string
  position: number
  confidence_level: number
  reasoning: string
  regulatory_hook?: string
  business_impact?: string
}

interface CompanyPositionsProps {
  companies: Company[]
}

export default function CompanyPositions({ companies }: CompanyPositionsProps) {
  if (!companies || companies.length === 0) return null

  // Sort companies by position (descending - most positive first)
  const sortedCompanies = [...companies].sort((a, b) => b.position - a.position)

  const getPositionColor = (position: number) => {
    if (position >= 0.3) return "text-green-700 bg-green-50 border-green-200"
    if (position <= -0.3) return "text-red-700 bg-red-50 border-red-200"
    return "text-yellow-700 bg-yellow-50 border-yellow-200"
  }

  const getPositionLabel = (position: number) => {
    if (position >= 0.3) return "Bullish"
    if (position <= -0.3) return "Bearish"
    return "Neutral"
  }

  const getPositionIcon = (position: number) => {
    if (position >= 0.3) return "↗"
    if (position <= -0.3) return "↘"
    return "→"
  }

  return (
    <div className="space-y-3">
      <h5 className="font-semibold text-foreground">Company Positions Analysis</h5>
      
      <div className="space-y-3">
        {sortedCompanies.map((company) => (
          <div
            key={company.ticker}
            className="border border-border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            {/* Header with ticker and position */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="font-bold text-lg text-foreground">
                  {company.ticker}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPositionColor(company.position)}`}>
                  {getPositionIcon(company.position)} {getPositionLabel(company.position)}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  company.position >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {company.position >= 0 ? '+' : ''}{(company.position * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-foreground/60">
                  Confidence: {(company.confidence_level * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Confidence bar */}
            <div className="mb-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${company.confidence_level * 100}%` }}
                />
              </div>
            </div>

            {/* Reasoning */}
            <div className="space-y-2">
              <div key={`${company.ticker}-reasoning`}>
                <div className="text-xs font-semibold text-foreground/80 mb-1">Analysis:</div>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {company.reasoning}
                </p>
              </div>

              {/* Regulatory Hook */}
              {company.regulatory_hook && (
                <div key={`${company.ticker}-regulatory`}>
                  <div className="text-xs font-semibold text-foreground/80 mb-1">Regulatory Impact:</div>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {company.regulatory_hook}
                  </p>
                </div>
              )}

              {/* Business Impact */}
              {company.business_impact && (
                <div key={`${company.ticker}-business`}>
                  <div className="text-xs font-semibold text-foreground/80 mb-1">Business Impact:</div>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {company.business_impact}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {sortedCompanies.filter(c => c.position >= 0.3).length}
            </div>
            <div className="text-xs text-foreground/60">Bullish</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {sortedCompanies.filter(c => c.position > -0.3 && c.position < 0.3).length}
            </div>
            <div className="text-xs text-foreground/60">Neutral</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {sortedCompanies.filter(c => c.position <= -0.3).length}
            </div>
            <div className="text-xs text-foreground/60">Bearish</div>
          </div>
        </div>
      </div>
    </div>
  )
}
