interface Country {
  country: string
  impact: number
  direction: 'positive' | 'negative' | 'neutral'
}

interface GeographicImpactProps {
  countries: Country[]
}

export default function GeographicImpact({ countries }: GeographicImpactProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-1">
        {[...countries]
          .filter((country) => country.impact !== 0)
          .sort((a, b) => {
            // Positifs d'abord (décroissant), puis négatifs (croissant = moins négatif d'abord)
            if (a.impact >= 0 && b.impact >= 0) return b.impact - a.impact;
            if (a.impact < 0 && b.impact < 0) return b.impact - a.impact;
            return b.impact - a.impact;
          })
          .map((country, i) => (
            <span 
              key={i} 
              className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
                country.direction === 'positive' ? 'bg-green-100 text-green-800 border border-green-200' : 
                country.direction === 'negative' ? 'bg-red-100 text-red-800 border border-red-200' : 
                'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
            >
              {country.country} {country.impact > 0 ? '↑' : country.impact < 0 ? '↓' : '→'} {Math.abs(country.impact * 100).toFixed(0)}%
            </span>
          ))}
    </div>
  )
}
