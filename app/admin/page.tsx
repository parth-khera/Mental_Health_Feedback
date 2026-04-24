import { getAdminDB } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import Navbar from '@/components/Navbar'

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

const SENTIMENT_COLORS: Record<string, string> = {
  positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  neutral:  'bg-amber-50 text-amber-700 border-amber-200',
  negative: 'bg-red-50 text-red-700 border-red-200',
}

async function getFeedback(): Promise<Feedback[]> {
  const db = getAdminDB()
  const snap = await db.collection('feedback').orderBy('createdAt', 'desc').get()
  return snap.docs.map(doc => {
    const d = doc.data()
    const ts = d.createdAt as Timestamp | null
    return {
      id:          doc.id,
      name:        d.name ?? '—',
      email:       d.email ?? '—',
      collegeId:   d.collegeId ?? '—',
      contact:     d.contact ?? null,
      ageRange:    d.ageRange ?? '—',
      gender:      d.gender ?? '—',
      yearOfStudy: d.yearOfStudy ?? '—',
      visitReason: d.visitReason ?? '—',
      text:        d.text ?? null,
      rating:      d.rating ?? 0,
      tags:        d.tags ?? [],
      sentiment:   d.sentiment ?? 'neutral',
      imageUrl:    d.imageUrl ?? null,
      createdAt:   ts ? ts.toDate().toLocaleString('en-IN') : '—',
    }
  })
}

export default async function AdminPage() {
  const feedbacks = await getFeedback()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8faf8] pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Feedback Submissions</h1>
              <p className="text-sm text-gray-400 mt-1">{feedbacks.length} total responses</p>
            </div>
            <div className="flex gap-3 text-xs">
              {['positive','neutral','negative'].map(s => (
                <span key={s} className={`px-3 py-1.5 rounded-full border font-medium capitalize ${SENTIMENT_COLORS[s]}`}>
                  {feedbacks.filter(f => f.sentiment === s).length} {s}
                </span>
              ))}
            </div>
          </div>

          {feedbacks.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center text-gray-400 text-sm">
              No feedback submitted yet.
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map(f => (
                <div key={f.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">

                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-gray-900 text-sm">{f.name}</p>
                      <p className="text-xs text-gray-400">{f.email} · {f.collegeId}</p>
                      {f.contact && <p className="text-xs text-gray-400">{f.contact}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Stars */}
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} viewBox="0 0 24 24" className="w-4 h-4"
                            fill={s <= f.rating ? '#f59e0b' : '#e5e7eb'}>
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">{f.rating}</span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${SENTIMENT_COLORS[f.sentiment] ?? ''}`}>
                        {f.sentiment}
                      </span>
                      <span className="text-xs text-gray-400">{f.createdAt}</span>
                    </div>
                  </div>

                  {/* Details row */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[f.ageRange, f.gender, f.yearOfStudy, f.visitReason].map((val, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-600">
                        {val}
                      </span>
                    ))}
                  </div>

                  {/* Feedback text */}
                  {f.text && (
                    <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-sage-200 pl-3">
                      {f.text}
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

                  {/* Image */}
                  {f.imageUrl && (
                    <a href={f.imageUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-500 underline">
                      View attached image
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
