import { NextRequest, NextResponse } from 'next/server'
import { getAdminDB } from '@/lib/firebase-admin'
import { getStorage } from 'firebase-admin/storage'
import { FieldValue } from 'firebase-admin/firestore'

const MAX_TEXT_LENGTH = 500
const MAX_TAGS = 5
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const VALID_AGE_RANGES   = ['Under 18', '18-20', '21-23', '24-26', '27+']
const VALID_GENDERS      = ['Female', 'Male', 'Non-binary', 'Prefer not to say', 'Other']
const VALID_YEARS        = ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Graduate', 'Other']
const VALID_VISIT_REASONS = ['Individual Therapy', 'Group Therapy', 'Couples Therapy', 'Family Therapy', 'Crisis Intervention', 'Assessment/Evaluation', 'Other']

function deriveSentiment(rating: number): 'positive' | 'neutral' | 'negative' {
  if (rating >= 3.5) return 'positive'
  if (rating >= 2.5) return 'neutral'
  return 'negative'
}

function sanitize(text: string, max = MAX_TEXT_LENGTH): string {
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

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()

    const name       = sanitize((fd.get('name') as string) ?? '', 100)
    const email      = sanitize((fd.get('email') as string) ?? '', 200)
    const collegeId  = sanitize((fd.get('collegeId') as string) ?? '', 50)
    const contact    = sanitize((fd.get('contact') as string) ?? '', 20)
    const ageRange   = (fd.get('ageRange') as string) ?? ''
    const gender     = (fd.get('gender') as string) ?? ''
    const yearOfStudy = (fd.get('yearOfStudy') as string) ?? ''
    const visitReason = (fd.get('visitReason') as string) ?? ''
    const rawRating = fd.get('rating')
    const rawText   = fd.get('text')
    const image     = fd.get('image')
    const imageFile = image instanceof File ? image : null

    // Required personal details
    if (!name)  return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    if (!collegeId) return NextResponse.json({ error: 'College ID is required.' }, { status: 400 })
    if (!VALID_AGE_RANGES.includes(ageRange))
      return NextResponse.json({ error: 'Valid age range is required.' }, { status: 400 })
    if (!VALID_GENDERS.includes(gender))
      return NextResponse.json({ error: 'Valid gender selection is required.' }, { status: 400 })
    if (!VALID_YEARS.includes(yearOfStudy))
      return NextResponse.json({ error: 'Valid year of study is required.' }, { status: 400 })
    if (!VALID_VISIT_REASONS.includes(visitReason))
      return NextResponse.json({ error: 'Valid visit reason is required.' }, { status: 400 })

    // Rating
    const rating = parseFloat(rawRating as string)
    if (isNaN(rating) || rating < 0.5 || rating > 5)
      return NextResponse.json({ error: 'Rating must be between 0.5 and 5.' }, { status: 400 })

    const text = sanitize((rawText as string) ?? '')
    const tags = parseTags(fd.get('tags'))

    // Image upload
    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type))
        return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and GIF images are allowed.' }, { status: 400 })
      if (imageFile.size > MAX_IMAGE_SIZE)
        return NextResponse.json({ error: 'Image must be under 5 MB.' }, { status: 400 })

      const buffer   = Buffer.from(await imageFile.arrayBuffer())
      const ext      = imageFile.name.split('.').pop() ?? 'jpg'
      const filename = `feedback-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const bucket   = getStorage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!)
      const file     = bucket.file(filename)
      await file.save(buffer, { contentType: imageFile.type, public: true })
      imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`
    }

    // Save to Firestore
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
      imageUrl,
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
