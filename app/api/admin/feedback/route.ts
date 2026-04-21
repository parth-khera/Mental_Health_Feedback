import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Feedback from '@/models/Feedback'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const rating   = searchParams.get('rating')
  const keyword  = searchParams.get('keyword')
  const from     = searchParams.get('from')
  const to       = searchParams.get('to')
  const page     = parseInt(searchParams.get('page') ?? '1', 10)
  const limit    = 20

  const filter: Record<string, any> = {}
  if (rating)  filter.rating = parseInt(rating, 10)
  if (keyword) filter.text   = { $regex: keyword, $options: 'i' }
  if (from || to) {
    filter.createdAt = {}
    if (from) filter.createdAt.$gte = new Date(from)
    if (to)   filter.createdAt.$lte = new Date(to)
  }

  await connectDB()

  const [items, total, ratingAgg, sentimentAgg] = await Promise.all([
    Feedback.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Feedback.countDocuments(filter),
    Feedback.aggregate([{ $group: { _id: '$rating', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Feedback.aggregate([{ $group: { _id: '$sentiment', value: { $sum: 1 } } }]),
  ])

  const ratingDist   = [1,2,3,4,5].map(r => ({ rating: r, count: ratingAgg.find((a: any) => a._id === r)?.count ?? 0 }))
  const sentimentDist = sentimentAgg.map((s: any) => ({ name: s._id, value: s.value }))
  const avgRating     = items.length ? (items.reduce((s: number, f: any) => s + f.rating, 0) / items.length).toFixed(1) : '0'

  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit), ratingDist, sentimentDist, avgRating })
}
