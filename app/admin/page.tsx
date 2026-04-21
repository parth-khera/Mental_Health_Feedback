'use client'
import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import FeedbackCard from '@/components/FeedbackCard'
import AnalyticsCharts from '@/components/AnalyticsCharts'

interface FeedbackItem {
  _id: string; text: string; rating: number; sentiment?: string; imageUrl?: string; createdAt: string
}
interface ApiData {
  items: FeedbackItem[]; total: number; page: number; pages: number
  ratingDist: { rating: number; count: number }[]
  sentimentDist: { name: string; value: number }[]
  avgRating: string
}

function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100/80 shadow-soft p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <div className="w-8 h-8 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600">{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 space-y-3">
      <div className="animate-shimmer h-3 rounded-full w-3/4" />
      <div className="animate-shimmer h-3 rounded-full w-1/2" />
      <div className="animate-shimmer h-3 rounded-full w-2/3" />
    </div>
  )
}

export default function AdminPage() {
  const [secret,  setSecret]  = useState('')
  const [authed,  setAuthed]  = useState(false)
  const [authErr, setAuthErr] = useState('')
  const [data,    setData]    = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [rating,  setRating]  = useState('')
  const [keyword, setKeyword] = useState('')
  const [from,    setFrom]    = useState('')
  const [to,      setTo]      = useState('')
  const [page,    setPage]    = useState(1)

  const fetchData = useCallback(async (pg = 1) => {
    setLoading(true); setError('')
    const params = new URLSearchParams({ page: String(pg) })
    if (rating)  params.set('rating',  rating)
    if (keyword) params.set('keyword', keyword)
    if (from)    params.set('from',    from)
    if (to)      params.set('to',      to)
    try {
      const res = await fetch(`/api/admin/feedback?${params}`, { headers: { 'x-admin-secret': secret } })
      if (res.status === 401) { setAuthed(false); setAuthErr('Session expired.'); return }
      if (!res.ok) throw new Error('Failed to load data.')
      setData(await res.json())
      setPage(pg)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [secret, rating, keyword, from, to])

  useEffect(() => { if (authed) fetchData(1) }, [authed, fetchData])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!secret.trim()) { setAuthErr('Enter the admin secret.'); return }
    setAuthErr('')
    setAuthed(true)
  }

  /* ── Login screen ── */
  if (!authed) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center px-6 pt-16">
          <div className="w-full max-w-sm space-y-6 animate-in">
            {/* Icon */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-sage-400 to-sage-600
                flex items-center justify-center mx-auto shadow-sage">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Enter your secret key to access feedback data.</p>
              </div>
            </div>

            <div className="card space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Admin Secret Key</label>
                  <input
                    type="password"
                    className="input-base"
                    placeholder="••••••••••••"
                    value={secret}
                    onChange={e => setSecret(e.target.value)}
                    autoFocus
                  />
                </div>
                {authErr && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5 animate-in">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {authErr}
                  </p>
                )}
                <button type="submit" className="btn-primary w-full py-3">
                  Access Dashboard
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </main>
      </>
    )
  }

  /* ── Dashboard ── */
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto space-y-7">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 animate-in pt-4">
            <div>
              <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-1">Admin</p>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Feedback Dashboard</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {data ? `${data.total} total submissions` : 'Loading data…'}
              </p>
            </div>
            <button onClick={() => fetchData(page)}
              className="btn-ghost text-xs px-4 py-2 gap-1.5 shrink-0">
              <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin-slow' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button>
          </div>

          {/* Stat cards */}
          {data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in animate-in-delay-1">
              <StatCard label="Total Responses" value={data.total} sub="all time"
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>}
              />
              <StatCard label="Avg Rating" value={`${data.avgRating} ★`} sub="out of 5"
                icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
              />
              <StatCard
                label="Positive"
                value={`${data.sentimentDist.find(s => s.name === 'positive')?.value ?? 0}`}
                sub="responses"
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>}
              />
              <StatCard
                label="Need Attention"
                value={`${data.sentimentDist.find(s => s.name === 'negative')?.value ?? 0}`}
                sub="negative responses"
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>}
              />
            </div>
          )}

          {/* Charts */}
          {data && <div className="animate-in animate-in-delay-2"><AnalyticsCharts ratingDist={data.ratingDist} sentimentDist={data.sentimentDist} /></div>}

          {/* Filters */}
          <div className="bg-white rounded-3xl border border-gray-100/80 shadow-soft p-5 space-y-4 animate-in animate-in-delay-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-800">Filter Feedback</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <select className="input-base text-sm" value={rating} onChange={e => setRating(e.target.value)}>
                <option value="">All ratings</option>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
              </select>
              <input className="input-base text-sm" placeholder="Search keyword…" value={keyword} onChange={e => setKeyword(e.target.value)} />
              <input className="input-base text-sm" type="date" value={from} onChange={e => setFrom(e.target.value)} />
              <input className="input-base text-sm" type="date" value={to}   onChange={e => setTo(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => fetchData(1)} className="btn-primary text-xs px-5 py-2">Apply</button>
              <button onClick={() => { setRating(''); setKeyword(''); setFrom(''); setTo(''); fetchData(1) }}
                className="btn-ghost text-xs px-5 py-2">Clear all</button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-700 animate-in">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {/* Skeletons */}
          {loading && (
            <div className="space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} />)}
            </div>
          )}

          {/* Feedback list */}
          {!loading && data && (
            <>
              {data.items.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">No feedback matches your filters</p>
                  <p className="text-xs text-gray-400">Try adjusting or clearing the filters above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.items.map((item, i) => (
                    <div key={item._id} className="animate-in" style={{ animationDelay: `${i * 40}ms` }}>
                      <FeedbackCard {...item} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4">
                  <button onClick={() => fetchData(page - 1)} disabled={page <= 1}
                    className="btn-ghost text-xs px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed">
                    ← Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(data.pages, 5) }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => fetchData(p)}
                        className={`w-8 h-8 rounded-xl text-xs font-medium transition-all duration-200 ${
                          p === page ? 'bg-sage-500 text-white shadow-sage' : 'text-gray-500 hover:bg-gray-100'
                        }`}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => fetchData(page + 1)} disabled={page >= data.pages}
                    className="btn-ghost text-xs px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}
