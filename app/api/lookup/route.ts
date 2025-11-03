import { NextResponse } from 'next/server'

const LOOKUP_API_URL = 'https://ni0f1yaaed.execute-api.us-west-2.amazonaws.com/prod/api/lookup'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('[Lookup API] Calling backend with enhanced data')

    // Call AWS lookup endpoint
    const response = await fetch(LOOKUP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('[Lookup API] Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Lookup API] Backend error:', errorText)
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
    console.log('[Lookup API] Success, job_id:', data.job_id)

    return NextResponse.json(data)

  } catch (error) {
    console.error('[Lookup API] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get lookup data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
