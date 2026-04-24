import { NextRequest, NextResponse } from 'next/server'
import { getAdminDB } from '@/lib/firebase-admin'
import { getStorage } from 'firebase-admin/storage'
import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { FieldValue } from 'firebase-admin/firestore'

// Input validation constants
const MAX_TEXT_LENGTH = 500
const MAX_TAGS = 5
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

function ensureAdmin() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase admin credentials')
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    })
  }
}

function deriveSentiment(rating: number): 'positive' | 'neutral' | 'negative' {
  if (rating >= 3.5) return 'positive'
  if (rating >= 2.5) return 'neutral'
  return 'negative'
}

function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .slice(0, MAX_TEXT_LENGTH)
}

function validateTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return []
  return tags
    .filter((tag): tag is string => typeof tag === 'string')
    .map(tag => tag.slice(0, 50)) // Limit tag length
    .slice(0, MAX_TAGS)
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const rawText = formData.get('text')
    const rawRating = formData.get('rating')
    const rawTags = formData.get('tags')
    const image = formData.get('image') as File | null

    // Validate text
    if (typeof rawText !== 'string' || !rawText.trim()) {
      return NextResponse.json({ error: 'Feedback text is required.' }, { status: 400 })
    }
    const text = sanitizeText(rawText)

    // Validate rating
    const rating = parseFloat(rawRating as string)
    if (isNaN(rating) || rating < 0.5 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 0.5 and 5.' }, { status: 400 })
    }

    // Validate and sanitize tags
    let tags: string[] = []
    if (rawTags) {
      try {
        tags = validateTags(JSON.parse(rawTags as string))
      } catch {
        tags = []
      }
    }

    ensureAdmin()

    let imageUrl: string | undefined

    // Upload image to Firebase Storage
    if (image && image.size > 0) {
      // Validate image type
      if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return NextResponse.json(
          { error: 'Invalid image type. Only JPEG, PNG, WebP, and GIF are allowed.' },
          { status: 400 }
        )
      }

      // Validate image size
      if (image.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Image must be under 5 MB.' },
          { status: 400 }
        )
      }

      const bytes    = await image.arrayBuffer()
      const buffer   = Buffer.from(bytes)
      const ext      = image.name.split('.').pop() ?? 'jpg'
      const filename = `feedback-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const bucket = getStorage().bucket()
      const file   = bucket.file(filename)
      await file.save(buffer, { contentType: image.type, public: true })
      imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`
    }

    // Save to Firestore
    const db  = getAdminDB()
    const ref = await db.collection('feedback').add({
      text:      text.trim(),
      rating,
      tags,
      sentiment: deriveSentiment(rating),
      imageUrl:  imageUrl ?? null,
      createdAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: ref.id }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/feedback]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
