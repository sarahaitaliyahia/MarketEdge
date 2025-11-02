import { NextResponse } from 'next/server'

const DECISION_API_URL = 'https://ni0f1yaaed.execute-api.us-west-2.amazonaws.com/prod/api/decision'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sp500_analysis } = body

    if (!sp500_analysis) {
      return NextResponse.json(
        { error: 'Missing sp500_analysis in request body' },
        { status: 400 }
      )
    }

    console.log('[Decision API] Calling backend with analysis data')

    // Call AWS decision endpoint to get analysis_id
    const response = await fetch(DECISION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sp500_analysis }),
    })

    console.log('[Decision API] Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Decision API] Backend error:', errorText)
      return NextResponse.json(
        { 
          error: 'Backend error',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[Decision API] Success, analysis_id:', data.analysis_id)

    return NextResponse.json(data)

  } catch (error) {
    console.error('[Decision API] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get decision',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
