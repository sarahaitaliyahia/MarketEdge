"use client"

import React, { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { CompanyData } from "@/lib/types"
import { X, TrendingUp, TrendingDown, AlertCircle, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Dynamic import to avoid SSR issues with ApexCharts
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface CompanyHeatMapProps {
  readonly companies: CompanyData[]
}

// Color mapping based on PredictedPosition (-1 to 1)
function getColor(position: number): string {
  if (position >= 0.6) return "#16a34a" // green-600
  if (position >= 0.3) return "#22c55e" // green-500
  if (position >= 0.1) return "#86efac" // green-300
  if (position >= -0.1) return "#fde047" // yellow-300
  if (position >= -0.3) return "#fb923c" // orange-400
  if (position >= -0.6) return "#f87171" // red-400
  return "#dc2626" // red-600
}

export default function CompanyHeatMap({ companies }: CompanyHeatMapProps) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null)

  // Prepare data for ApexCharts Treemap
  const { series, companyMap } = useMemo(() => {
    // Group companies by sector
    const sectorGroups: Record<string, CompanyData[]> = {}
    const map: Record<string, CompanyData> = {}

    for (const company of companies) {
      const sector = company.sector || "Other"
      if (!sectorGroups[sector]) {
        sectorGroups[sector] = []
      }
      sectorGroups[sector].push(company)
      map[company.Ticker] = company
    }

    // Convert to ApexCharts series format
    const chartSeries = Object.keys(sectorGroups).map((sector) => ({
      name: sector,
      data: sectorGroups[sector].map((company) => ({
        x: company.Ticker,
        y: company.market_cap_basic || 100000, // Use market cap for size
        fillColor: getColor(company.PredictedPosition),
        meta: company, // Store company data for tooltip
      })),
    }))

    return { series: chartSeries, companyMap: map }
  }, [companies])

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "treemap",
      height: 600,
      toolbar: {
        show: false,
      },
      events: {
        dataPointSelection: (_event, _chartContext, config) => {
          const ticker = config.w.config.series[config.seriesIndex].data[config.dataPointIndex].x
          const company = companyMap[ticker]
          if (company) {
            setSelectedCompany(company)
          }
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      fontSize: "14px",
      fontFamily: "inherit",
      markers: {
        size: 12,
        radius: 2,
      },
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
        dataLabels: {
          format: "truncate",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontFamily: "inherit",
        fontWeight: "bold",
      },
      offsetY: -4,
      formatter: (text: string | number | number[]) => {
        return String(text)
      },
    },
    tooltip: {
      enabled: true,
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const dataPoint = w.config.series[seriesIndex].data[dataPointIndex]
        const company = dataPoint.meta as CompanyData
        const change = company.PredictedPosition
        const changePercent = (change * 100).toFixed(1)
        const confidence = (company.confidence_level * 100).toFixed(0)
        const marketCap = company.market_cap_basic
          ? `$${(company.market_cap_basic / 1000).toFixed(1)}B`
          : "N/A"

        return `
          <div class="p-3 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
            <div class="font-bold text-lg mb-2">${company.Ticker}</div>
            <div class="text-sm space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-600">Sector:</span>
                <span class="font-medium">${company.sector || "N/A"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Position:</span>
                <span class="font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}">
                  ${change >= 0 ? '+' : ''}${changePercent}%
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Confidence:</span>
                <span class="font-medium">${confidence}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Market Cap:</span>
                <span class="font-medium">${marketCap}</span>
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-2 italic">Click for details</div>
          </div>
        `
      },
    },
    colors: companies.map((c) => getColor(c.PredictedPosition)),
  }

  // Helper functions for modal
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`
  }

  const getSentiment = (position: number): { label: string; icon: React.ReactNode; color: string } => {
    if (position >= 0.3) {
      return {
        label: "Bullish",
        icon: <TrendingUp className="h-4 w-4" />,
        color: "text-green-600",
      }
    } else if (position <= -0.3) {
      return {
        label: "Bearish",
        icon: <TrendingDown className="h-4 w-4" />,
        color: "text-red-600",
      }
    } else {
      return {
        label: "Neutral",
        icon: <AlertCircle className="h-4 w-4" />,
        color: "text-yellow-600",
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">Company Position Heat Map</h3>
      </div>

      {/* ApexCharts Treemap */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        {typeof globalThis.window !== "undefined" && (
          <Chart options={chartOptions} series={series} type="treemap" height={600} />
        )}
      </div>

      {/* Color Legend */}
      <div className="flex items-center justify-center gap-2 text-xs">
        <span className="text-foreground/60">Bearish</span>
        <div className="flex gap-1">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#dc2626" }}></div>
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#f87171" }}></div>
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#fb923c" }}></div>
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#fde047" }}></div>
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#86efac" }}></div>
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#22c55e" }}></div>
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#16a34a" }}></div>
        </div>
        <span className="text-foreground/60">Bullish</span>
      </div>

      {/* Modal for company details */}
      {selectedCompany && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedCompany(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedCompany(null)
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="company-detail-title"
        >
          <Card
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-blue-50 to-blue-100/50 border-b border-blue-200 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 id="company-detail-title" className="text-3xl font-bold text-foreground">
                      {selectedCompany.Ticker}
                    </h2>
                    <Badge
                      className={`${getSentiment(selectedCompany.PredictedPosition).color} bg-white/80 px-3 py-1`}
                      variant="outline"
                    >
                      <div className="flex items-center gap-1">
                        {getSentiment(selectedCompany.PredictedPosition).icon}
                        <span className="font-semibold">{getSentiment(selectedCompany.PredictedPosition).label}</span>
                      </div>
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Position prédite */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Predicted Position
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/70">Market Position:</span>
                    <span className="font-bold text-xl">{formatPercentage(selectedCompany.PredictedPosition)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${((selectedCompany.PredictedPosition + 1) / 2) * 100}%`,
                        backgroundColor: getColor(selectedCompany.PredictedPosition),
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-foreground/60">
                    <span>-100% (Bearish)</span>
                    <span>0% (Neutral)</span>
                    <span>+100% (Bullish)</span>
                  </div>
                </div>
              </div>

              {/* Niveau de confiance */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                  Confidence Level
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/70">Model Confidence:</span>
                    <span className="font-bold text-xl">{formatPercentage(selectedCompany.confidence_level)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-purple-600 transition-all duration-500"
                      style={{ width: `${selectedCompany.confidence_level * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-foreground/60">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                  <div className="mt-3 p-3 bg-white/60 rounded-lg">
                    <p className="text-sm text-foreground/70">
                      {(() => {
                        if (selectedCompany.confidence_level >= 0.7) {
                          return "High confidence - Strong signal strength"
                        } else if (selectedCompany.confidence_level >= 0.5) {
                          return "Medium confidence - Moderate signal strength"
                        } else {
                          return "Lower confidence - Consider additional research"
                        }
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Raisonnement */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-green-600" />
                  Analysis Reasoning
                </h3>
                <p className="text-foreground/80 leading-relaxed">{selectedCompany.reasoning}</p>
              </div>

              {/* Métriques résumées */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-sm text-foreground/60 mb-1">Position Score</p>
                  <p className="text-2xl font-bold">
                    {selectedCompany.PredictedPosition > 0 ? "+" : ""}
                    {selectedCompany.PredictedPosition.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-sm text-foreground/60 mb-1">Confidence</p>
                  <p className="text-2xl font-bold">{(selectedCompany.confidence_level * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
