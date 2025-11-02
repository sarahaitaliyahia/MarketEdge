import { NextResponse } from "next/server"
import type { LookupResponse } from "@/lib/types"

// Données mockées pour le développement
const MOCK_LOOKUP_DATA: LookupResponse = {
  "companies": [
    {
      "Ticker": "AAPL",
      "PredictedPosition": 0.72,
      "reasoning": "Strong Q4 earnings, resilient iPhone demand in China despite supply chain pressures, and growing AI integration in devices.",
      "confidence_level": 0.61,
      "sector": "Technology",
      "market_cap_basic": 2600000,
      "change": 0.035
    },
    {
      "Ticker": "TSLA",
      "PredictedPosition": 0.35,
      "reasoning": "Positive long-term growth in energy storage and AI-driven robotics, but short-term margins under pressure from EV price wars.",
      "confidence_level": 0.47,
      "sector": "Automotive",
      "market_cap_basic": 900000,
      "change": 0.012
    },
    {
      "Ticker": "AMZN",
      "PredictedPosition": 0.58,
      "reasoning": "AWS showing strong rebound in enterprise demand; consumer spending stable despite macro uncertainty.",
      "confidence_level": 0.55,
      "sector": "Consumer Discretionary",
      "market_cap_basic": 1700000,
      "change": 0.022
    },
    {
      "Ticker": "NVDA",
      "PredictedPosition": 0.89,
      "reasoning": "Dominant position in AI chip market, continued data center growth, and strong ecosystem lock-in among hyperscalers.",
      "confidence_level": 0.73,
      "sector": "Semiconductors",
      "market_cap_basic": 1500000,
      "change": 0.048
    },
    {
      "Ticker": "META",
      "PredictedPosition": 0.44,
      "reasoning": "Ad revenue stabilization, promising AI model integration, but facing regulatory and metaverse ROI concerns.",
      "confidence_level": 0.49,
      "sector": "Technology",
      "market_cap_basic": 900000,
      "change": 0.018
    },
    {
      "Ticker": "XOM",
      "PredictedPosition": -0.22,
      "reasoning": "Energy transition policies expected to impact long-term profitability; oil price volatility poses short-term uncertainty.",
      "confidence_level": 0.58,
      "sector": "Energy",
      "market_cap_basic": 350000,
      "change": -0.024
    },
    {
      "Ticker": "NFLX",
      "PredictedPosition": 0.27,
      "reasoning": "Content strategy and global subscriber growth steady, but valuation stretched and competition intensifying.",
      "confidence_level": 0.42,
      "sector": "Communication Services",
      "market_cap_basic": 150000,
      "change": 0.005
    },
    {
      "Ticker": "GOOGL",
      "PredictedPosition": 0.64,
      "reasoning": "Search and cloud divisions performing well; Gemini and AI infrastructure providing competitive edge.",
      "confidence_level": 0.68,
      "sector": "Technology",
      "market_cap_basic": 1600000,
      "change": 0.031
    },
    {
      "Ticker": "MSFT",
      "PredictedPosition": 0.79,
      "reasoning": "Azure growth accelerating due to AI workloads, strong enterprise positioning, and diversification across sectors.",
      "confidence_level": 0.74,
      "sector": "Technology",
      "market_cap_basic": 2200000,
      "change": 0.039
    },
    {
      "Ticker": "COIN",
      "PredictedPosition": -0.41,
      "reasoning": "Crypto market recovery uncertain; high regulatory risk in the U.S. and dependency on trading volume.",
      "confidence_level": 0.52,
      "sector": "Financials",
      "market_cap_basic": 50000,
      "change": -0.045
    }
  ],
  "ai_synthesis": {
    "summary": "Synthèse stratégique générée avec succès",
    "recommendations": "Voici un résumé et une interprétation des résultats d'analyse du S&P500, accompagnés d'une stratégie d'investissement claire et concise, des principaux risques à surveiller et d'une conclusion professionnelle :\n\nRésumé de la situation globale du marché\nLes résultats montrent une tendance globalement positive pour les principales entreprises technologiques, en particulier celles bien positionnées dans l'intelligence artificielle (IA) et le cloud. Cependant, certains secteurs plus traditionnels comme l'énergie et les cryptomonnaies font face à des défis importants.\n\nSecteurs gagnants/perdants\nLes grands gagnants semblent être les entreprises de semi-conducteurs (NVDA), de cloud et d'IA (MSFT, GOOGL, AMZN) qui bénéficient de la demande croissante pour ces technologies. Les entreprises pétrolières (XOM) et les plateformes de cryptomonnaies (COIN) sont en revanche mal positionnées face aux défis réglementaires et environnementaux.\n\nStratégie d'investissement\nDans ce contexte, je recommanderais une stratégie d'investissement axée sur les entreprises leaders du secteur technologique offrant des solutions d'IA et de cloud computing. Une pondération plus importante pourrait être accordée aux entreprises comme NVDA, MSFT et GOOGL qui semblent les mieux positionnées. Une approche plus défensive avec une sous-pondération des secteurs à risque comme l'énergie et les cryptomonnaies serait judicieuse.\n\nPrincipaux risques à surveiller  \nLes principaux risques à prendre en compte sont les potentielles guerres de prix dans les véhicules électriques, l'incertitude réglementaire autour de l'IA et de la protection des données, ainsi que la volatilité des prix du pétrole. La dépendance excessive de certaines entreprises à un segment de marché spécifique (comme les cryptomonnaies pour COIN) est également un facteur de risque non négligeable.\n\nConclusion professionnelle\nEn conclusion, bien que le marché dans son ensemble semble offrir des opportunités intéressantes, une approche sélective et équilibrée centrée sur les leaders technologiques de l'IA et du cloud semble la plus judicieuse dans le contexte actuel. Une gestion active des risques, en particulier réglementaires et sectoriels, sera essentielle pour optimiser les rendements ajustés au risque. Une réévaluation régulière de la stratégie en fonction de l'évolution du paysage concurrentiel et technologique est recommandée.",
    "metadata": {
      "model_used": "anthropic.claude-3-sonnet-20240229-v1:0",
      "prompt_mode": "summary",
      "language": "fr",
      "execution_time_seconds": 11.54
    }
  }
}

/**
 * GET /api/lookup
 * Récupère les données de position des entreprises et la synthèse AI
 */
export async function GET() {
  try {
    // TODO: Remplacer par l'appel au backend réel
    // const backendUrl = process.env.BACKEND_LOOKUP_URL || 'http://backend-service/lookup'
    // const response = await fetch(backendUrl)
    // if (!response.ok) {
    //   throw new Error(`Backend returned ${response.status}`)
    // }
    // const data = await response.json()
    
    // Pour l'instant, retourner les données mockées
    return NextResponse.json(MOCK_LOOKUP_DATA)
  } catch (error) {
    console.error("Error fetching lookup data:", error)
    return NextResponse.json(
      { error: "Failed to fetch lookup data" },
      { status: 500 }
    )
  }
}
