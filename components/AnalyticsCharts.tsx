'use client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

interface Props {
  ratingDist: { rating: number; count: number }[]
  sentimentDist: { name: string; value: number }[]
}

const BAR_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']

const SENTIMENT_COLORS: Record<string, string> = {
  positive: '#22c55e',
  neutral:  '#eab308',
  negative: '#ef4444',
}

const SENTIMENT_LABELS: Record<string, string> = {
  positive: 'Positive',
  neutral:  'Neutral',
  negative: 'Negative',
}

function CustomBarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-2xl shadow-large border border-gray-100 px-4 py-3">
      <p className="text-xs text-gray-500 mb-0.5">Rating {payload[0].payload.rating} ★</p>
      <p className="text-lg font-semibold text-gray-900">{payload[0].value} <span className="text-sm font-normal text-gray-400">responses</span></p>
    </div>
  )
}

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-2xl shadow-large border border-gray-100 px-4 py-3">
      <p className="text-xs text-gray-500 mb-0.5">{SENTIMENT_LABELS[payload[0].name] ?? payload[0].name}</p>
      <p className="text-lg font-semibold text-gray-900">{payload[0].value} <span className="text-sm font-normal text-gray-400">responses</span></p>
    </div>
  )
}

export default function AnalyticsCharts({ ratingDist, sentimentDist }: Props) {
  const total = sentimentDist.reduce((s, d) => s + d.value, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {/* Ratings bar chart */}
      <div className="bg-white rounded-3xl border border-gray-100/80 shadow-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Ratings Distribution</h3>
            <p className="text-xs text-gray-400 mt-0.5">How students rated their sessions</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={ratingDist} barSize={32} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="rating" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false}
              tickFormatter={(v) => `${v}★`} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f9fafb', radius: 8 }} />
            <Bar dataKey="count" radius={[8, 8, 4, 4]}>
              {ratingDist.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sentiment donut */}
      <div className="bg-white rounded-3xl border border-gray-100/80 shadow-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Sentiment Breakdown</h3>
            <p className="text-xs text-gray-400 mt-0.5">Overall emotional tone of feedback</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-sage-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={sentimentDist} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} strokeWidth={0}>
                {sentimentDist.map((entry) => (
                  <Cell key={entry.name} fill={SENTIMENT_COLORS[entry.name] ?? '#e5e7eb'} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex-1 space-y-2.5">
            {sentimentDist.map((entry) => {
              const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0
              return (
                <div key={entry.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: SENTIMENT_COLORS[entry.name] ?? '#e5e7eb' }} />
                      <span className="text-xs text-gray-600 capitalize">{SENTIMENT_LABELS[entry.name] ?? entry.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: SENTIMENT_COLORS[entry.name] ?? '#e5e7eb' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
