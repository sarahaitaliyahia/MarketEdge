import { NextResponse } from 'next/server'

const CHAT_API_URL = 'https://ni0f1yaaed.execute-api.us-west-2.amazonaws.com/prod/api/chat'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { session_id, message } = body

    if (!session_id || !message) {
      return NextResponse.json(
        { error: 'Missing session_id or message' },
        { status: 400 }
      )
    }

    console.log('[Chat API] Calling backend with:', { session_id, message })

    // Call AWS SageMaker chat endpoint
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'analysisId': session_id,
      },
      body: JSON.stringify({
        message: message,
        analysis_id: session_id,
      }),
    })

    console.log('[Chat API] Backend response status:', response.status)
    console.log('[Chat API] Backend response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Chat API] Backend error response:', errorText)
      console.error('[Chat API] Request details:', {
        url: CHAT_API_URL,
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'analysisId': session_id 
        },
        body: { message, analysis_id: session_id }
      })
      
      // Return the backend error to the frontend
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
    console.log('[Chat API] Success, response:', data)

    return NextResponse.json(data)

  } catch (error) {
    console.error('[Chat API] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
