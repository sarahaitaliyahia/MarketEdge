interface Sector {
  sector: string
  impact: number
}

interface SectorImpactProps {
  sectors: Sector[]
}

export default function SectorImpact({ sectors }: SectorImpactProps) {
  return (
    <div className="space-y-3">
      <h5 className="font-semibold text-foreground">Sector Impact Analysis</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[...sectors]
          .sort((a, b) => {
            // Positifs d'abord (décroissant), puis négatifs (croissant = moins négatif d'abord)
            if (a.impact >= 0 && b.impact >= 0) return b.impact - a.impact;
            if (a.impact < 0 && b.impact < 0) return b.impact - a.impact;
            return b.impact - a.impact;
          })
          .map((sector, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground text-sm">{sector.sector}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  sector.impact > 0 ? 'bg-green-100 text-green-700' : 
                  sector.impact < 0 ? 'bg-red-100 text-red-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {sector.impact > 0 ? '+' : ''}{(sector.impact * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    sector.impact > 0 ? 'bg-green-500' : 
                    sector.impact < 0 ? 'bg-red-500' : 
                    'bg-gray-400'
                  }`}
                  style={{ width: `${Math.abs(sector.impact) * 100}%` }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
