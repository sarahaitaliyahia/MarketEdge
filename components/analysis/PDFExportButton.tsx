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
}

export function PDFExportButton({ data, lawTitle, className }: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = () => {
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
      disabled={isGenerating}
      className={className}
      variant="default"
    >
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating PDF..." : "Download PDF Report"}
    </Button>
  )
}
