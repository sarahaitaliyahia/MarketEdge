interface PotentialRisksProps {
  risks: string[]
}

export default function PotentialRisks({ risks }: PotentialRisksProps) {
  if (!risks || risks.length === 0) return null
  
  return (
    <div className="space-y-3">
      <h5 className="font-semibold text-foreground flex items-center gap-2">
        <span className="h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
          {risks.length}
        </span>
        Potential Risks
      </h5>
      <ul className="space-y-2">
        {risks.map((risk: string, i: number) => (
          <li key={i} className="flex gap-2 text-sm text-foreground/80">
            <span className="text-red-600 font-bold mt-0.5">⚠</span>
            <span>{risk}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
