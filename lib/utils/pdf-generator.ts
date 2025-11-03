"use client"

import { LookupResponse } from "@/lib/types"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

/**
 * Generate a comprehensive PDF report from decision/lookup data
 */
export function generateDecisionPDF(data: LookupResponse, lawTitle?: string) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 20

  // Helper function to add page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 20) {
      doc.addPage()
      yPos = 20
      return true
    }
    return false
  }

  // Helper to add wrapped text
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 10,
    color: [number, number, number] = [0, 0, 0]
  ) => {
    doc.setFontSize(fontSize)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return lines.length * (fontSize * 0.4) // Approximate line height
  }

  // ===== HEADER =====
  doc.setFillColor(41, 128, 185) // Blue header
  doc.rect(0, 0, pageWidth, 40, "F")
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("MarketEdge", pageWidth / 2, 20, { align: "center" })
  
  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text("Investment Decision Analysis Report", pageWidth / 2, 30, { align: "center" })

  yPos = 50

  // ===== DOCUMENT INFO =====
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  
  if (lawTitle) {
    const titleHeight = addWrappedText(
      `Law Proposal: ${lawTitle}`,
      15,
      yPos,
      pageWidth - 30,
      11,
      [52, 73, 94]
    )
    yPos += titleHeight + 5
  }

  const analysisDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  doc.text(`Analysis Date: ${analysisDate}`, 15, yPos)
  yPos += 6
  doc.text(`Generated: ${new Date().toLocaleString()}`, 15, yPos)
  yPos += 6
  if (data.ai_synthesis?.metadata?.model_used) {
    doc.text(`Model: ${data.ai_synthesis.metadata.model_used}`, 15, yPos)
    yPos += 6
  }
  yPos += 6

  // Filter out success messages from summary
  const strategicSummary = data.ai_synthesis?.summary
    ?.split('\n')
    .filter(line => !line.includes('générée avec succès') && !line.includes('generated successfully'))
    .join('\n')
    .trim()

  // Get recommendations (filter the header line)
  const recommendations = data.ai_synthesis?.recommendations
    ?.split('\n')
    .filter(line => !line.includes("Résumé et interprétation des résultats d'analyse du S&P500"))
    .join('\n')
    .trim()

  // ===== STRATEGIC SUMMARY =====
    // Si le summary est vide, utiliser le début des recommendations
    const strategicText = strategicSummary && strategicSummary.length > 10
      ? strategicSummary
      : (recommendations ? recommendations.split('\n\n')[0] : '')

    if (strategicText) {
      checkPageBreak(30)
      doc.setFillColor(236, 240, 241)
      doc.rect(15, yPos - 5, pageWidth - 30, 10, "F")
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(147, 51, 234) // Purple-600
      doc.text("Strategic Summary", 20, yPos)
      yPos += 12

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(0, 0, 0)

      // Purple left border for full summary
      doc.setFillColor(147, 51, 234) // Purple-600
      doc.rect(15, yPos - 3, 3, 20, "F")
    
      // Light purple background
      doc.setFillColor(250, 245, 255) // Purple-50
      doc.rect(19, yPos - 3, pageWidth - 37, 20, "F")

      // Full summary text
      const summaryHeight = addWrappedText(
        strategicText,
        22,
        yPos,
        pageWidth - 42,
        9,
        [107, 114, 128] // Gray-500
      )
    
      yPos += summaryHeight + 15
    }

  // ===== INVESTMENT RECOMMENDATIONS =====
  if (recommendations) {
    checkPageBreak(30)
    doc.setFillColor(236, 240, 241)
    doc.rect(15, yPos - 5, pageWidth - 30, 10, "F")
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(41, 128, 185)
    doc.text("Investment Recommendations", 20, yPos)
    yPos += 12

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)

    // Split by double newlines to create sections with blue sidebar effect
    const sections = recommendations.split(/\n\n+/).filter(s => s.trim())
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim()
      
      checkPageBreak(20)
      
      // Blue left border effect (simulated with a filled rectangle)
      doc.setFillColor(37, 99, 235) // Blue-600
      doc.rect(15, yPos - 3, 2, 15, "F") // Blue sidebar
      
      // Light background
      doc.setFillColor(255, 255, 255)
      doc.rect(18, yPos - 3, pageWidth - 36, 15, "F")
      
      // Section text
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(17, 24, 39) // Gray-900
      const textHeight = addWrappedText(
        section,
        20,
        yPos,
        pageWidth - 40,
        9,
        [17, 24, 39]
      )
      
      yPos += textHeight + 8
    }
    
    yPos += 10
  }

  // ===== COMPANIES ANALYSIS TABLE =====
  checkPageBreak(40)
  doc.setFillColor(236, 240, 241)
  doc.rect(15, yPos - 5, pageWidth - 30, 10, "F")
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(41, 128, 185)
  doc.text("Company Positions Analysis", 20, yPos)
  yPos += 12

  // Prepare table data
  const tableData = data.companies.map((company) => [
    company.ticker,
    `${(company.position * 100).toFixed(1)}%`,
    `${(company.confidence_level * 100).toFixed(0)}%`,
  ])

  autoTable(doc, {
    startY: yPos,
    head: [["Ticker", "Position", "Confidence"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40 },
      1: { cellWidth: 40, halign: "center" },
      2: { cellWidth: 40, halign: "center" },
    },
    willDrawCell: (data) => {
      // Color code the Position column background BEFORE text is drawn
      if (data.column.index === 1 && data.section === "body") {
        const position = Number.parseFloat(String(data.cell.text[0]).replace("%", "")) / 100
        if (position >= 0.3) {
          doc.setFillColor(200, 230, 201) // Light Green
        } else if (position <= -0.3) {
          doc.setFillColor(255, 205, 210) // Light Red
        } else {
          doc.setFillColor(255, 249, 196) // Light Yellow
        }
      }
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // ===== DETAILED COMPANY REASONING =====
  checkPageBreak(30)
  doc.setFillColor(236, 240, 241)
  doc.rect(15, yPos - 5, pageWidth - 30, 10, "F")
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(41, 128, 185)
  doc.text("Detailed Company Analysis", 20, yPos)
  yPos += 12

  for (const [index, company] of data.companies.entries()) {
    checkPageBreak(50)

    // Company header
    doc.setFillColor(245, 245, 245)
    doc.rect(15, yPos - 4, pageWidth - 30, 8, "F")
    
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(33, 33, 33)
    doc.text(`${index + 1}. ${company.ticker}`, 20, yPos)
    
    // Position indicator
    const position = company.position
    let positionColor: [number, number, number]
    if (position >= 0.3) {
      positionColor = [76, 175, 80]
    } else if (position <= -0.3) {
      positionColor = [244, 67, 54]
    } else {
      positionColor = [255, 193, 7]
    }
    doc.setTextColor(...positionColor)
    doc.setFont("helvetica", "bold")
    doc.text(
      `${position >= 0 ? "+" : ""}${(position * 100).toFixed(1)}%`,
      pageWidth - 20,
      yPos,
      { align: "right" }
    )
    yPos += 10

    // Reasoning
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(60, 60, 60)
    const reasoningHeight = addWrappedText(company.reasoning, 20, yPos, pageWidth - 40, 9, [60, 60, 60])
    yPos += reasoningHeight + 5

    // Regulatory Hook (if exists)
    if (company.regulatory_hook) {
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(120, 40, 200)
      doc.text("Regulatory Impact:", 20, yPos)
      yPos += 4
      doc.setFont("helvetica", "normal")
      doc.setTextColor(80, 80, 80)
      const regHeight = addWrappedText(company.regulatory_hook, 20, yPos, pageWidth - 40, 8, [80, 80, 80])
      yPos += regHeight + 4
    }

    // Business Impact (if exists)
    if (company.business_impact) {
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(41, 128, 185)
      doc.text("Business Impact:", 20, yPos)
      yPos += 4
      doc.setFont("helvetica", "normal")
      doc.setTextColor(80, 80, 80)
      const bizHeight = addWrappedText(company.business_impact, 20, yPos, pageWidth - 40, 8, [80, 80, 80])
      yPos += bizHeight + 4
    }

    // Confidence
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `Confidence: ${(company.confidence_level * 100).toFixed(0)}%`,
      20,
      yPos
    )
    yPos += 10

    if (index < data.companies.length - 1) {
      doc.setDrawColor(200, 200, 200)
      doc.line(15, yPos - 3, pageWidth - 15, yPos - 3)
      yPos += 2
    }
  }



  // ===== FOOTER ON EVERY PAGE =====
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `MarketEdge Analysis Report | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    )
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      pageWidth - 15,
      pageHeight - 10,
      { align: "right" }
    )
  }

  // Save the PDF
  const fileName = `MarketEdge_Decision_Analysis_${new Date().toISOString().split("T")[0]}.pdf`
  doc.save(fileName)
}
