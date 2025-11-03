'use client'

import { useState } from 'react'

interface KeyFindingsSectionProps {
  keyFindings?: string[]
  potentialRisks?: string[]
}

export default function KeyFindingsSection({
  keyFindings,
  potentialRisks,
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
      
      {/* Potential Risks */}
      {potentialRisks && potentialRisks.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-semibold text-foreground flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
              {potentialRisks.length}
            </span>
            Potential Risks
          </h5>
          <ul className="space-y-2">
            {potentialRisks.map((risk: string, i: number) => (
              <li key={i} className="flex gap-2 text-sm text-foreground/80">
                <span className="text-red-600 font-bold mt-0.5">⚠</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
