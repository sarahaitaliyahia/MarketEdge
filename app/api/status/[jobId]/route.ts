import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = "https://ni0f1yaaed.execute-api.us-west-2.amazonaws.com/prod/api"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Call AWS API status endpoint
    const statusUrl = `${API_BASE_URL}/status/${jobId}`
    
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    // Return the same status code and data from AWS
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check job status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
