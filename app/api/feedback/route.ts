import { NextRequest, NextResponse } from 'next/server'
import { getAdminDB } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

// ── Constants ────────────────────────────────────────────────────────────────
const MAX_TEXT_LENGTH  = 500
const MAX_TAGS         = 5
const MAX_BODY_BYTES   = 2 * 1024 * 1024 // 2 MB hard limit

const VALID_AGE_RANGES    = ['Under 18', '18-20', '21-23', '24-26', '27+'] as const
const VALID_GENDERS       = ['Female', 'Male', 'Non-binary', 'Prefer not to say', 'Other'] as const
const VALID_YEARS         = ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Graduate', 'Other'] as const
const VALID_VISIT_REASONS = ['Individual Therapy', 'Group Therapy', 'Couples Therapy', 'Family Therapy', 'Crisis Intervention', 'Assessment/Evaluation', 'Other'] as const

// ── In-memory rate limiter ───────────────────────────────────────────────────
// Allows 5 submissions per IP per hour
// Works on any Node.js host (no Redis needed)
const RATE_LIMIT_MAX      = 5
const RATE_LIMIT_WINDOW   = 60 * 60 * 1000 // 1 hour in ms
const ipStore             = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now    = Date.now()
  cleanupStore()
  const record = ipStore.get(ip)

  if (!record || now > record.resetAt) {
    ipStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (record.count >= RATE_LIMIT_MAX) return true

  record.count++
  return false
}

// Clean up expired entries inline during rate limit check
function cleanupStore() {
  const now = Date.now()
  for (const [ip, record] of ipStore.entries()) {
    if (now > record.resetAt) ipStore.delete(ip)
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function deriveSentiment(rating: number): 'positive' | 'neutral' | 'negative' {
  if (rating >= 3.5) return 'positive'
  if (rating >= 2.5) return 'neutral'
  return 'negative'
}

function sanitize(text: string, max: number): string {
  return text.trim().replace(/<[^>]*>/g, '').slice(0, max)
}

function parseTags(raw: FormDataEntryValue | null): string[] {
  if (!raw) return []
  try {
    const arr = JSON.parse(raw as string)
    if (!Array.isArray(arr)) return []
    return arr
      .filter((t): t is string => typeof t === 'string')
      .map(t => t.slice(0, 50))
      .slice(0, MAX_TAGS)
  } catch (_) { return [] }
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

// ── POST /api/feedback ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = getClientIP(req)
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      )
    }

    // 2. Request size guard
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Request too large.' },
        { status: 413 }
      )
    }

    // 3. Parse form data
    const fd = await req.formData()

    // 4. Extract and sanitize fields
    const name        = sanitize((fd.get('name')        as string) ?? '', 100)
    const email       = sanitize((fd.get('email')       as string) ?? '', 200)
    const collegeId   = sanitize((fd.get('collegeId')   as string) ?? '', 50)
    const contact     = sanitize((fd.get('contact')     as string) ?? '', 20)
    const ageRange    = (fd.get('ageRange')    as string) ?? ''
    const gender      = (fd.get('gender')      as string) ?? ''
    const yearOfStudy = (fd.get('yearOfStudy') as string) ?? ''
    const visitReason = (fd.get('visitReason') as string) ?? ''
    const rawRating   = fd.get('rating')
    const rawText     = fd.get('text')

    // 5. Validate required fields
    if (!name)
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    if (!collegeId)
      return NextResponse.json({ error: 'College ID is required.' }, { status: 400 })
    if (!(VALID_AGE_RANGES as readonly string[]).includes(ageRange))
      return NextResponse.json({ error: 'Valid age range is required.' }, { status: 400 })
    if (!(VALID_GENDERS as readonly string[]).includes(gender))
      return NextResponse.json({ error: 'Valid gender selection is required.' }, { status: 400 })
    if (!(VALID_YEARS as readonly string[]).includes(yearOfStudy))
      return NextResponse.json({ error: 'Valid year of study is required.' }, { status: 400 })
    if (!(VALID_VISIT_REASONS as readonly string[]).includes(visitReason))
      return NextResponse.json({ error: 'Valid visit reason is required.' }, { status: 400 })

    // 6. Validate rating
    const rating = parseFloat(rawRating as string)
    if (isNaN(rating) || rating < 0.5 || rating > 5)
      return NextResponse.json({ error: 'Rating must be between 0.5 and 5.' }, { status: 400 })

    const text = sanitize((rawText as string) ?? '', MAX_TEXT_LENGTH)
    const tags = parseTags(fd.get('tags'))

    // 7. Save to Firestore
    const db  = getAdminDB()
    const ref = await db.collection('feedback').add({
      name,
      email,
      collegeId,
      contact:     contact || null,
      ageRange,
      gender,
      yearOfStudy,
      visitReason,
      text:        text || null,
      rating,
      tags,
      sentiment:   deriveSentiment(rating),
      createdAt:   FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: ref.id }, { status: 201 })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/feedback]', message)
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? message : 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
