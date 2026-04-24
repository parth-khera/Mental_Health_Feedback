import { format } from 'date-fns'
import Image from 'next/image'

interface Props {
  text: string
  rating: number
  sentiment?: string
  imageUrl?: string
  createdAt: string
  ageRange?: string
  gender?: string
  yearOfStudy?: string
  visitReason?: string
}

const sentimentConfig: Record<string, { label: string; color: string; bg: string; bar: string }> = {
  positive: { label: 'Positive', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100', bar: 'bg-emerald-400' },
  neutral:  { label: 'Neutral',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-100',     bar: 'bg-amber-400'   },
  negative: { label: 'Negative', color: 'text-red-600',     bg: 'bg-red-50 border-red-100',         bar: 'bg-red-400'     },
}

// Color mapping for decimal ratings
function getRatingColor(rating: number): string {
  if (rating >= 4.5) return '#22c55e' // green
  if (rating >= 3.5) return '#84cc16' // lime
  if (rating >= 2.5) return '#eab308' // yellow
  if (rating >= 1.5) return '#f97316' // orange
  return '#ef4444' // red
}

// Fix: ensure proper color access with defaults

function getStarState(star: number, rating: number) {
  if (rating >= star) return 'full'
  if (rating >= star - 0.5) return 'half'
  return 'empty'
}

export default function FeedbackCard({ 
  text, 
  rating, 
  sentiment, 
  imageUrl, 
  createdAt,
  ageRange,
  gender,
  yearOfStudy,
  visitReason 
}: Props) {
  const s = sentiment ? sentimentConfig[sentiment] : null
  const color = getRatingColor(rating)

  return (
    <div className="group bg-white rounded-3xl border border-gray-100/80
      shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.05)]
      hover:shadow-[0_4px_8px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)]
      hover:-translate-y-0.5 transition-all duration-300 ease-spring overflow-hidden">

      {/* Sentiment color bar */}
      {s && <div className={`h-0.5 w-full ${s.bar} opacity-60`} />}

      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          {/* Stars */}
          <div className="flex gap-0.5 mt-0.5">
            {[1,2,3,4,5].map((star) => {
              const state = getStarState(star, rating)
              return (
                <svg key={star} viewBox="0 0 24 24" className="w-4 h-4 transition-transform duration-150">
                  {state === 'half' ? (
                    <>
                      <defs>
                        <clipPath id={`card-half-${star}`}>
                          <rect x="0" y="0" width="12" height="24" />
                        </clipPath>
                      </defs>
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        fill="#e5e7eb" />
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        fill={color}
                        clipPath={`url(#card-half-${star})`}
                        style={{ filter: `drop-shadow(0 1px 3px ${color}50)` }} />
                    </>
                  ) : (
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      fill={state === 'full' ? color : '#e5e7eb'}
                      style={state === 'full' ? { filter: `drop-shadow(0 1px 3px ${color}50)` } : {}} />
                  )}
                </svg>
              )
            })}
          </div>

          {/* Sentiment badge */}
          {s && (
            <span className={`badge border text-xs ${s.bg} ${s.color} shrink-0`}>
              {s.label}
            </span>
          )}
        </div>

        {/* Text */}
        <p className="text-sm text-gray-700 leading-relaxed">{text}</p>

        {/* Personal Details */}
        {(ageRange || gender || yearOfStudy || visitReason) && (
          <div className="text-xs text-gray-500 space-y-1">
            {ageRange && <span className="flex items-center gap-1"><span>🎂</span>{ageRange}</span>}
            {gender && <span className="flex items-center gap-1"><span>👤</span>{gender}</span>}
            {yearOfStudy && <span className="flex items-center gap-1"><span>🎓</span>{yearOfStudy}</span>}
            {visitReason && <span className="flex items-center gap-1"><span>🏥</span>{visitReason}</span>}
          </div>
        )}

        {/* Image */}
        {imageUrl && (
          <div className="rounded-2xl overflow-hidden mt-3">
            <Image src={imageUrl} alt="Attached" width={400} height={200}
              className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">{format(new Date(createdAt), 'MMM d, yyyy · h:mm a')}</p>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <div key={s} className="h-1 w-4 rounded-full transition-all duration-300"
                style={{ background: s <= rating ? color : '#f3f4f6' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
