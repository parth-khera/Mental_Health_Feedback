import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Feedback from '@/models/Feedback'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const text   = formData.get('text') as string
    const rating = parseInt(formData.get('rating') as string, 10)
    const image  = formData.get('image') as File | null

    if (!text?.trim()) return NextResponse.json({ error: 'Feedback text is required.' }, { status: 400 })
    if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: 'Rating must be 1–5.' }, { status: 400 })

    let imageUrl: string | undefined
    if (image && image.size > 0) {
      if (image.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Image must be under 5 MB.' }, { status: 400 })
      const bytes  = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const ext    = image.name.split('.').pop() ?? 'jpg'
      const name   = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const dir    = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(dir, { recursive: true })
      await writeFile(path.join(dir, name), buffer)
      imageUrl = `/uploads/${name}`
    }

    await connectDB()
    const feedback = await Feedback.create({ text: text.trim(), rating, imageUrl })

    return NextResponse.json({ success: true, id: feedback._id }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
