import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Enhance: Receiving request...')
    
    // Appeler votre endpoint AWS /enhance
    const response = await fetch(
      'https://ni0f1yaaed.execute-api.us-west-2.amazonaws.com/prod/api/enhance',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    console.log('Enhance: Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Enhance: API error:', errorText)
      return NextResponse.json(
        { error: `API error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Enhance: Success, returning data')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Enhance: Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
