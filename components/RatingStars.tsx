'use client'
import { useState } from 'react'

interface Props {
  value: number
  onChange: (v: number) => void
}

const moods = ['', '😔', '😕', '😐', '🙂', '😊']
const labels = ['', 'Poor', 'Fair', 'Okay', 'Good', 'Excellent']
const colors = ['', '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']

export default function RatingStars({ value, onChange }: Props) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= active
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`Rate ${star} out of 5`}
              style={{ '--star-color': colors[star] } as React.CSSProperties}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center
                transition-all duration-200 ease-spring
                ${isActive
                  ? 'scale-110 shadow-medium'
                  : 'scale-100 bg-gray-50 hover:bg-gray-100 hover:scale-105'
                }`}
              data-active={isActive}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 transition-all duration-200"
                style={{
                  fill: isActive ? colors[star] : 'none',
                  stroke: isActive ? colors[star] : '#d1d5db',
                  filter: isActive ? `drop-shadow(0 2px 6px ${colors[star]}60)` : 'none',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
                strokeWidth="1.5"
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </button>
          )
        })}
      </div>

      {/* Mood indicator */}
      <div className={`flex items-center gap-3 transition-all duration-300 ${active > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <span className="text-2xl transition-all duration-300" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
          {moods[active]}
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{labels[active]}</p>
          <div className="flex gap-0.5 mt-1">
            {[1,2,3,4,5].map(s => (
              <div key={s} className="h-1 w-6 rounded-full transition-all duration-300"
                style={{ background: s <= active ? colors[active] : '#e5e7eb' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
