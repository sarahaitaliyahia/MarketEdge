"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { generateDecisionPDF } from "@/lib/utils/pdf-generator"
import { LookupResponse } from "@/lib/types"
import { useState } from "react"

interface PDFExportButtonProps {
  readonly data: LookupResponse
  readonly lawTitle?: string
  readonly className?: string
  readonly disabled?: boolean
}

export function PDFExportButton({ data, lawTitle, className, disabled }: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = () => {
    if (disabled) return
    setIsGenerating(true)
    try {
      generateDecisionPDF(data, lawTitle)
    } catch (error) {
      console.error("Failed to generate PDF:", error)
    } finally {
      setTimeout(() => setIsGenerating(false), 1000) // Small delay for UX
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled || isGenerating}
      className={className}
      variant="default"
    >
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating PDF..." : "Download PDF Report"}
    </Button>
  )
}
