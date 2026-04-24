import { getAdminDB } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Feedback {
  id: string
  name: string
  email: string
  collegeId: string
  contact: string | null
  ageRange: string
  gender: string
  yearOfStudy: string
  visitReason: string
  text: string | null
  rating: number
  tags: string[]
  sentiment: string
  imageUrl: string | null
  createdAt: string
}

const SENTIMENT_STYLES = {
  positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  neutral:  'bg-amber-50 text-amber-700 border-amber-200',
  negative: 'bg-red-50 text-red-700 border-red-200',
} as const

type Sentiment = keyof typeof SENTIMENT_STYLES

function sentimentStyle(s: string): string {
  return SENTIMENT_STYLES[s as Sentiment] ?? 'bg-gray-50 text-gray-600 border-gray-200'
}

async function getFeedback(): Promise<Feedback[]> {
  const db   = getAdminDB()
  const snap = await db.collection('feedback').orderBy('createdAt', 'desc').get()
  return snap.docs.map(doc => {
    const d  = doc.data()
    const ts = d.createdAt instanceof Timestamp ? d.createdAt : null
    return {
      id:          doc.id,
      name:        typeof d.name        === 'string' ? d.name        : '—',
      email:       typeof d.email       === 'string' ? d.email       : '—',
      collegeId:   typeof d.collegeId   === 'string' ? d.collegeId   : '—',
      contact:     typeof d.contact     === 'string' ? d.contact     : null,
      ageRange:    typeof d.ageRange    === 'string' ? d.ageRange    : '—',
      gender:      typeof d.gender      === 'string' ? d.gender      : '—',
      yearOfStudy: typeof d.yearOfStudy === 'string' ? d.yearOfStudy : '—',
      visitReason: typeof d.visitReason === 'string' ? d.visitReason : '—',
      text:        typeof d.text        === 'string' ? d.text        : null,
      rating:      typeof d.rating      === 'number' ? d.rating      : 0,
      tags:        Array.isArray(d.tags) ? (d.tags as string[]) : [],
      sentiment:   typeof d.sentiment   === 'string' ? d.sentiment   : 'neutral',
      imageUrl:    typeof d.imageUrl    === 'string' ? d.imageUrl    : null,
      createdAt:   ts ? ts.toDate().toLocaleString('en-IN') : '—',
    }
  })
}

export default async function AdminPage() {
  let feedbacks: Feedback[] = []
  let fetchError = ''

  try {
    feedbacks = await getFeedback()
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Failed to load feedback.'
  }

  const counts = {
    positive: feedbacks.filter(f => f.sentiment === 'positive').length,
    neutral:  feedbacks.filter(f => f.sentiment === 'neutral').length,
    negative: feedbacks.filter(f => f.sentiment === 'negative').length,
  }

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—'

  return (
    <div className="min-h-screen bg-[#f8faf8]">

      {/* Simple admin header — no client Navbar needed */}
      <header className="bg-white border-b border-gray-100 px-6 h-[60px] flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-sm">MindSpace · Admin</span>
        </div>
        <Link href="/" className="text-xs text-sage-600 hover:text-sage-800 font-medium transition-colors">
          ← Back to site
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Error state */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700">
            {fetchError}
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total',    value: feedbacks.length, color: 'text-gray-900' },
            { label: 'Positive', value: counts.positive,  color: 'text-emerald-600' },
            { label: 'Neutral',  value: counts.neutral,   color: 'text-amber-600' },
            { label: 'Negative', value: counts.negative,  color: 'text-red-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Avg rating */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <svg key={s} viewBox="0 0 24 24" className="w-5 h-5"
                fill={s <= Math.round(parseFloat(avgRating)) ? '#f59e0b' : '#e5e7eb'}>
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700">{avgRating} average rating</span>
          <span className="text-xs text-gray-400">across {feedbacks.length} submissions</span>
        </div>

        {/* Feedback list */}
        {feedbacks.length === 0 && !fetchError ? (
          <div className="bg-white rounded-3xl p-16 text-center text-gray-400 text-sm border border-gray-100">
            No feedback submitted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map(f => (
              <div key={f.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">

                {/* Top row: identity + rating */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-gray-900 text-sm">{f.name}</p>
                    <p className="text-xs text-gray-400">{f.email} · ID: {f.collegeId}</p>
                    {f.contact && <p className="text-xs text-gray-400">📞 {f.contact}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex gap-0.5 items-center">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} viewBox="0 0 24 24" className="w-4 h-4"
                          fill={s <= f.rating ? '#f59e0b' : '#e5e7eb'}>
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1 font-medium">{f.rating}</span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${sentimentStyle(f.sentiment)}`}>
                      {f.sentiment}
                    </span>
                    <span className="text-xs text-gray-400">{f.createdAt}</span>
                  </div>
                </div>

                {/* Detail chips */}
                <div className="flex flex-wrap gap-2">
                  {([
                    { label: 'Age',    value: f.ageRange },
                    { label: 'Gender', value: f.gender },
                    { label: 'Year',   value: f.yearOfStudy },
                    { label: 'Reason', value: f.visitReason },
                  ] as { label: string; value: string }[]).map(({ label, value }) => (
                    <span key={label} className="text-xs px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-600">
                      <span className="text-gray-400 mr-1">{label}:</span>{value}
                    </span>
                  ))}
                </div>

                {/* Feedback text */}
                {f.text && (
                  <p className="text-sm text-gray-700 leading-relaxed pl-3"
                    style={{ borderLeft: '2px solid #c0d9c0' }}>
                    &ldquo;{f.text}&rdquo;
                  </p>
                )}

                {/* Tags */}
                {f.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {f.tags.map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Image link */}
                {f.imageUrl && (
                  <a href={f.imageUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 underline transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    View attached image
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
