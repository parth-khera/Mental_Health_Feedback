import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    FB_PROJECT_ID:   process.env.FB_PROJECT_ID   ? 'SET' : 'MISSING',
    FB_CLIENT_EMAIL: process.env.FB_CLIENT_EMAIL ? 'SET' : 'MISSING',
    FB_PRIVATE_KEY:  process.env.FB_PRIVATE_KEY  ? `SET (length: ${process.env.FB_PRIVATE_KEY.length})` : 'MISSING',
    NODE_ENV:        process.env.NODE_ENV,
  })
}
