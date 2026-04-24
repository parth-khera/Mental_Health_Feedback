'use client'
import { useState } from 'react'

interface Props {
  value: number
  onChange: (v: number) => void
  size?: 'lg' | 'sm'
}

const LABELS: Record<number, string> = {
  0: 'Tap to rate',
  0.5: 'Terrible',
  1: 'Terrible',
  1.5: 'Poor',
  2: 'Poor',
  2.5: 'Below Average',
  3: 'Okay',
  3.5: 'Good',
  4: 'Good',
  4.5: 'Excellent',
  5: 'Excellent',
}
const COLORS: Record<number, string> = {
  0: '#e0e0e0',
  0.5: '#e53935',
  1: '#e53935',
  1.5: '#fb8c00',
  2: '#fb8c00',
  2.5: '#fdd835',
  3: '#fdd835',
  3.5: '#43a047',
  4: '#43a047',
  4.5: '#1e88e5',
  5: '#1e88e5',
}

export default function RatingStars({ value, onChange, size = 'lg' }: Props) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value
  const starSize = size === 'lg' ? 'w-12 h-12' : 'w-5 h-5'
  const gap = size === 'lg' ? 'gap-1' : 'gap-0.5'

  function getStarState(star: number, currentValue: number) {
    if (currentValue >= star) return 'full'
    if (currentValue >= star - 0.5) return 'half'
    return 'empty'
  }

  function handleStarClick(star: number, e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect()
    const isLeftHalf = e.clientX - rect.left < rect.width / 2
    const newValue = isLeftHalf ? star - 0.5 : star
    onChange(newValue)
  }

  function handleStarHover(star: number, e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect()
    const isLeftHalf = e.clientX - rect.left < rect.width / 2
    const newValue = isLeftHalf ? star - 0.5 : star
    setHovered(newValue)
  }

  function getColor(value: number): string {
    const keys = Object.keys(COLORS).map(Number).sort((a, b) => a - b)
    let color = COLORS[0] ?? '#e0e0e0'
    for (const key of keys) {
      if (value >= key) color = COLORS[key] ?? '#e0e0e0'
    }
    return color
  }

  return (
    <div className={`flex flex-col items-center ${size === 'lg' ? 'gap-3' : 'gap-1'}`}>
      <div className={`flex ${gap}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const state = getStarState(star, active)
          const color = getColor(active)
          return (
            <button
              key={star}
              type="button"
              onClick={(e) => handleStarClick(star, e)}
              onMouseEnter={(e) => handleStarHover(star, e)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`${star} star`}
              className={`${starSize} flex items-center justify-center relative
                transition-transform duration-100 ease-out
                hover:scale-125 active:scale-95 focus:outline-none`}
              style={{ willChange: 'transform' }}
            >
              <svg
                viewBox="0 0 48 48"
                className="w-full h-full"
                style={{
                  transition: 'fill 0.12s ease, filter 0.12s ease, transform 0.12s ease',
                  fill: state === 'empty' ? '#e0e0e0' : color,
                  filter: state !== 'empty' ? `drop-shadow(0 2px 6px ${color}80)` : 'none',
                  transform: state !== 'empty' ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                {state === 'half' ? (
                  <>
                    <defs>
                      <clipPath id={`half-${star}`}>
                        <rect x="0" y="0" width="24" height="48" />
                      </clipPath>
                    </defs>
                    <path d="M24 4l5.5 11.1 12.3 1.8-8.9 8.7 2.1 12.2L24 32.1l-11 5.7 2.1-12.2-8.9-8.7 12.3-1.8z" fill="#e0e0e0" />
                    <path d="M24 4l5.5 11.1 12.3 1.8-8.9 8.7 2.1 12.2L24 32.1l-11 5.7 2.1-12.2-8.9-8.7 12.3-1.8z" clipPath={`url(#half-${star})`} />
                  </>
                ) : (
                  <path d="M24 4l5.5 11.1 12.3 1.8-8.9 8.7 2.1 12.2L24 32.1l-11 5.7 2.1-12.2-8.9-8.7 12.3-1.8z" />
                )}
              </svg>
            </button>
          )
        })}
      </div>

      {/* Label */}
      {size === 'lg' && (
        <div className="h-7 flex items-center justify-center">
          {active > 0 ? (
            <span
              key={active}
              className="text-base font-semibold animate-in"
              style={{ color: getColor(active) }}
            >
              {LABELS[active] || LABELS[Math.floor(active)] || 'Tap to rate'}
            </span>
          ) : (
            <span className="text-sm text-gray-400">Tap to rate</span>
          )}
        </div>
      )}
    </div>
  )
}
