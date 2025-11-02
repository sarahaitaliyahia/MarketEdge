import { NextRequest, NextResponse } from 'next/server'

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'AKIA2UC3F4CKIK33RR7F'
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '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'
const AWS_REGION = process.env.AWS_REGION || 'us-west-2'
const S3_BUCKET = process.env.S3_BUCKET || 'law-analysis-documents'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, content } = body

    if (!filename || !content) {
      return NextResponse.json(
        { error: 'Missing filename or content' },
        { status: 400 }
      )
    }

    // Generate S3 key
    const timestamp = Date.now()
    const s3Key = `pdfs/${timestamp}-${filename}`

    console.log('Uploading to S3:', {
      bucket: S3_BUCKET,
      key: s3Key,
      size: content.length,
    })

    // Convert array back to Buffer
    const buffer = Buffer.from(content)

    // Upload to S3 using AWS SDK v3
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
    
    const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    })

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      Body: buffer,
      ContentType: 'application/pdf',
    })

    await s3Client.send(command)

    console.log('S3 upload successful')

    return NextResponse.json({
      bucket: S3_BUCKET,
      key: s3Key,
      size: buffer.length,
    })
  } catch (error) {
    console.error('S3 upload error:', error)
    return NextResponse.json(
      {
        error: 'S3 upload failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
