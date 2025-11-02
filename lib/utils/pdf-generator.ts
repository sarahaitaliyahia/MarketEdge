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
  doc.text(`Model: ${data.ai_synthesis.metadata.model_used}`, 15, yPos)
  yPos += 12

  // ===== EXECUTIVE SUMMARY =====
  checkPageBreak(30)
  doc.setFillColor(236, 240, 241)
  doc.rect(15, yPos - 5, pageWidth - 30, 10, "F")
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(41, 128, 185)
  doc.text("Executive Summary", 20, yPos)
  yPos += 12

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  const summaryHeight = addWrappedText(
    data.ai_synthesis.summary,
    15,
    yPos,
    pageWidth - 30,
    10,
    [52, 73, 94]
  )
  yPos += summaryHeight + 10

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
    company.Ticker,
    company.sector || "N/A",
    `${(company.PredictedPosition * 100).toFixed(1)}%`,
    `${(company.confidence_level * 100).toFixed(0)}%`,
    company.market_cap_basic ? `$${(company.market_cap_basic / 1000).toFixed(1)}B` : "N/A",
  ])

  autoTable(doc, {
    startY: yPos,
    head: [["Ticker", "Sector", "Position", "Confidence", "Market Cap"]],
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
      0: { fontStyle: "bold", cellWidth: 25 },
      1: { cellWidth: 40 },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 28, halign: "center" },
      4: { cellWidth: 30, halign: "right" },
    },
    willDrawCell: (data) => {
      // Color code the Position column background BEFORE text is drawn
      if (data.column.index === 2 && data.section === "body") {
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
    checkPageBreak(35)

    // Company header
    doc.setFillColor(245, 245, 245)
    doc.rect(15, yPos - 4, pageWidth - 30, 8, "F")
    
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(33, 33, 33)
    doc.text(`${index + 1}. ${company.Ticker} - ${company.sector || "N/A"}`, 20, yPos)
    
    // Position indicator
    const position = company.PredictedPosition
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
    yPos += reasoningHeight + 3

    // Confidence and Market Cap
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `Confidence: ${(company.confidence_level * 100).toFixed(0)}% | Market Cap: ${
        company.market_cap_basic ? `$${(company.market_cap_basic / 1000).toFixed(1)}B` : "N/A"
      }`,
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

  // ===== AI STRATEGIC RECOMMENDATIONS =====
  doc.addPage()
  yPos = 20

  doc.setFillColor(41, 128, 185)
  doc.rect(0, 0, pageWidth, 15, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("AI Strategic Recommendations", pageWidth / 2, 10, { align: "center" })
  yPos = 25

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)

  // Parse markdown-style recommendations
  const recommendations = data.ai_synthesis.recommendations
  const sections = recommendations.split(/(?=##\s)/) // Split by ## headers

  for (const section of sections) {
    if (!section.trim()) continue

    const lines = section.split("\n").filter((l) => l.trim())
    
    for (const line of lines) {
      checkPageBreak(15)

      if (line.startsWith("## ")) {
        // Section header
        if (yPos > 30) yPos += 5 // Add spacing before headers (except first)
        doc.setFillColor(236, 240, 241)
        doc.rect(15, yPos - 4, pageWidth - 30, 8, "F")
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(41, 128, 185)
        const headerText = line.replace("## ", "").replaceAll(/🏆|☁️|📱|⚡|🪙|🚗|📺|🔴|⚖️|🏭|🌍|💡|✅|⚠️/gu, "").trim()
        doc.text(headerText, 20, yPos)
        yPos += 10
      } else if (line.startsWith("### ")) {
        // Subsection header
        yPos += 3
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(52, 73, 94)
        const subHeaderText = line.replace("### ", "").replaceAll(/🏆|☁️|📱|⚡|🪙|🚗|📺|🔴|⚖️|🏭|🌍|💡|✅|⚠️/gu, "").trim()
        doc.text(subHeaderText, 20, yPos)
        yPos += 7
      } else if (/^\d+\./.exec(line)) {
        // Numbered list
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(60, 60, 60)
        const textHeight = addWrappedText(line, 25, yPos, pageWidth - 45, 9, [60, 60, 60])
        yPos += textHeight + 3
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        // Bullet list
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(60, 60, 60)
        const bulletText = line.replace(/^[-*]\s/, "")
        doc.text("•", 22, yPos)
        const textHeight = addWrappedText(bulletText, 28, yPos, pageWidth - 48, 9, [60, 60, 60])
        yPos += textHeight + 2
      } else if (line.startsWith("**") && line.endsWith("**")) {
        // Bold text
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(33, 33, 33)
        const boldText = line.replaceAll("**", "")
        const textHeight = addWrappedText(boldText, 20, yPos, pageWidth - 40, 10, [33, 33, 33])
        yPos += textHeight + 3
      } else if (line.trim().length > 0) {
        // Regular paragraph
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(60, 60, 60)
        const textHeight = addWrappedText(line, 20, yPos, pageWidth - 40, 9, [60, 60, 60])
        yPos += textHeight + 4
      }
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
