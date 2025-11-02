interface Country {
  country: string
  impact: number
  direction?: 'positive' | 'negative' | 'neutral'
}

interface ImpactedCountriesProps {
  countries: Country[]
}

export default function ImpactedCountries({ countries }: ImpactedCountriesProps) {
  return (
    <div className="space-y-3">
      <h5 className="font-semibold text-foreground">Impacted Countries</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...countries]
          .filter((country) => country.impact !== 0)
          .sort((a, b) => {
            // Positifs d'abord (décroissant), puis négatifs (croissant = moins négatif d'abord)
            if (a.impact >= 0 && b.impact >= 0) return b.impact - a.impact;
            if (a.impact < 0 && b.impact < 0) return b.impact - a.impact;
            return b.impact - a.impact;
          })
          .map((country, i) => (
            <div 
              key={i} 
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{country.country}</span>
                <span className={`text-sm font-bold ${
                  country.impact > 0 ? 'text-green-600' : 
                  country.impact < 0 ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {country.impact > 0 ? '+' : ''}{(country.impact * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
