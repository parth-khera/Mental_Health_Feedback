import { getAdminDB } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Feedback {
  id: string
  name: string
  email: string
  collegeId: string
  contact: string
  ageRange: string
  gender: string
  yearOfStudy: string
  visitReason: string
  text: string
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
  return SENTIMENT_STYLES[s as Sentiment] ?? 'bg-gray-50 text-gray-500 border-gray-200'
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
      contact:     typeof d.contact     === 'string' ? d.contact     : '—',
      ageRange:    typeof d.ageRange    === 'string' ? d.ageRange    : '—',
      gender:      typeof d.gender      === 'string' ? d.gender      : '—',
      yearOfStudy: typeof d.yearOfStudy === 'string' ? d.yearOfStudy : '—',
      visitReason: typeof d.visitReason === 'string' ? d.visitReason : '—',
      text:        typeof d.text        === 'string' ? d.text        : '—',
      rating:      typeof d.rating      === 'number' ? d.rating      : 0,
      tags:        Array.isArray(d.tags) ? (d.tags as string[]) : [],
      sentiment:   typeof d.sentiment   === 'string' ? d.sentiment   : 'neutral',
      imageUrl:    typeof d.imageUrl    === 'string' ? d.imageUrl    : null,
      createdAt:   ts ? ts.toDate().toLocaleString('en-IN') : '—',
    }
  })
}

const COLUMNS = [
  { key: 'no',          label: '#',            width: 'w-10' },
  { key: 'name',        label: 'Name',         width: 'w-36' },
  { key: 'email',       label: 'Email',        width: 'w-48' },
  { key: 'collegeId',   label: 'College ID',   width: 'w-28' },
  { key: 'contact',     label: 'Contact',      width: 'w-32' },
  { key: 'ageRange',    label: 'Age',          width: 'w-24' },
  { key: 'gender',      label: 'Gender',       width: 'w-28' },
  { key: 'yearOfStudy', label: 'Year',         width: 'w-28' },
  { key: 'visitReason', label: 'Visit Reason', width: 'w-40' },
  { key: 'rating',      label: 'Rating',       width: 'w-24' },
  { key: 'sentiment',   label: 'Sentiment',    width: 'w-24' },
  { key: 'tags',        label: 'Tags',         width: 'w-48' },
  { key: 'text',        label: 'Feedback',     width: 'w-64' },
  { key: 'imageUrl',    label: 'Image',        width: 'w-20' },
  { key: 'createdAt',   label: 'Submitted At', width: 'w-40' },
]

export default async function AdminPage() {
  let feedbacks: Feedback[] = []
  let fetchError = ''

  try {
    feedbacks = await getFeedback()
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Failed to load data.'
  }

  const total    = feedbacks.length
  const avgRating = total
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / total).toFixed(1)
    : '—'
  const positive = feedbacks.filter(f => f.sentiment === 'positive').length
  const neutral  = feedbacks.filter(f => f.sentiment === 'neutral').length
  const negative = feedbacks.filter(f => f.sentiment === 'negative').length

  return (
    <div className="min-h-screen bg-[#f8faf8]">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 h-[60px] flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-sm">MindSpace · Feedback Database</span>
        </div>
        <Link href="/" className="text-xs text-sage-600 hover:text-sage-800 font-medium transition-colors">
          ← Back to site
        </Link>
      </header>

      <main className="px-4 py-8 space-y-6 max-w-[1600px] mx-auto">

        {/* Error */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700">
            ⚠ {fetchError}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Total Responses', value: total,      color: 'text-gray-900' },
            { label: 'Avg Rating',      value: avgRating,  color: 'text-amber-600' },
            { label: 'Positive',        value: positive,   color: 'text-emerald-600' },
            { label: 'Neutral',         value: neutral,    color: 'text-amber-600' },
            { label: 'Negative',        value: negative,   color: 'text-red-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {feedbacks.length === 0 && !fetchError ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center text-gray-400 text-sm">
            No feedback submitted yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">

                {/* Head */}
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {COLUMNS.map(col => (
                      <th
                        key={col.key}
                        className={`${col.width} px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-gray-50">
                  {feedbacks.map((f, idx) => (
                    <tr key={f.id} className="hover:bg-gray-50/60 transition-colors duration-100">

                      {/* # */}
                      <td className="px-4 py-3 text-xs text-gray-400 font-medium">{idx + 1}</td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{f.name}</span>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 whitespace-nowrap">{f.email}</span>
                      </td>

                      {/* College ID */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                          {f.collegeId}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{f.contact}</td>

                      {/* Age */}
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{f.ageRange}</td>

                      {/* Gender */}
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{f.gender}</td>

                      {/* Year */}
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{f.yearOfStudy}</td>

                      {/* Visit Reason */}
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{f.visitReason}</td>

                      {/* Rating */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} viewBox="0 0 24 24" className="w-3 h-3"
                                fill={s <= f.rating ? '#f59e0b' : '#e5e7eb'}>
                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{f.rating}</span>
                        </div>
                      </td>

                      {/* Sentiment */}
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize whitespace-nowrap ${sentimentStyle(f.sentiment)}`}>
                          {f.sentiment}
                        </span>
                      </td>

                      {/* Tags */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {f.tags.length > 0
                            ? f.tags.map(tag => (
                                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 whitespace-nowrap">
                                  {tag}
                                </span>
                              ))
                            : <span className="text-xs text-gray-300">—</span>
                          }
                        </div>
                      </td>

                      {/* Feedback text */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-600 max-w-[240px] line-clamp-2 leading-relaxed" title={f.text}>
                          {f.text}
                        </p>
                      </td>

                      {/* Image */}
                      <td className="px-4 py-3">
                        {f.imageUrl ? (
                          <a href={f.imageUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-700 underline whitespace-nowrap">
                            View
                          </a>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>

                      {/* Submitted At */}
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{f.createdAt}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">Showing {total} record{total !== 1 ? 's' : ''} · sorted by latest first</p>
              <p className="text-xs text-gray-400">Firestore · feedback collection</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
