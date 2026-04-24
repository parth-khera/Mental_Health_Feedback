import Link from 'next/link'
import Navbar from '@/components/Navbar'

const features = [
  {
    title: 'Fully Anonymous',
    desc: 'No names, no IDs. Your identity is never collected or stored at any point.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    color: 'from-blue-50 to-indigo-50',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Secure & Encrypted',
    desc: 'All submissions are encrypted in transit and at rest. Your data is protected.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color: 'from-sage-50 to-emerald-50',
    iconBg: 'bg-sage-100 text-sage-600',
  },
  {
    title: 'Non-judgmental',
    desc: 'A safe space to share honestly. Every voice matters and is treated with care.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    color: 'from-rose-50 to-pink-50',
    iconBg: 'bg-rose-100 text-rose-600',
  },
  {
    title: 'Drives Real Change',
    desc: 'Your feedback directly shapes how counseling services improve for every student.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    color: 'from-violet-50 to-purple-50',
    iconBg: 'bg-violet-100 text-violet-600',
  },
]

const steps = [
  { n: '01', title: 'Rate your session', desc: 'Choose a 1–5 star rating that reflects your experience.' },
  { n: '02', title: 'Share your thoughts', desc: 'Write freely — no filters, no judgment, no identity.' },
  { n: '03', title: 'Submit anonymously', desc: 'Your feedback is sent securely with zero identifying data.' },
]

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full
            bg-gradient-radial from-sage-100/60 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full
            bg-gradient-radial from-blue-100/40 to-transparent blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full
            bg-gradient-radial from-sage-50/80 to-transparent blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          {/* Pill badge */}
          <div className="animate-in inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-white/80 backdrop-blur-sm border border-sage-200/60
            shadow-[0_2px_12px_rgba(74,124,89,0.12)] text-sage-700 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-500" />
            </span>
            Your voice shapes better care
          </div>

          {/* Headline */}
          <div className="animate-in animate-in-delay-1 space-y-3">
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold text-gray-900 leading-[1.1] tracking-tight">
              How was your<br />
              <span className="text-gradient">therapy session?</span>
            </h1>
            <p className="text-[clamp(1rem,2vw,1.2rem)] text-gray-500 max-w-lg mx-auto leading-relaxed font-light">
              Share your experience anonymously. Your honest feedback helps create a more
              supportive counseling environment for every student.
            </p>
          </div>

          {/* CTAs */}
          <div className="animate-in animate-in-delay-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/feedback" className="btn-primary text-[15px] px-8 py-3.5 shadow-sage-lg">
              Share Feedback
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href="#how-it-works" className="btn-ghost text-[15px] px-8 py-3.5">
              See how it works
            </Link>
          </div>

          {/* Trust strip */}
          <div className="animate-in animate-in-delay-3 flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2">
            {['100% Anonymous', 'No sign-up needed', 'End-to-end encrypted'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {t}
              </span>
            ))}
          </div>

          {/* Floating card preview */}
          <div className="animate-in animate-in-delay-4 animate-float mt-8 mx-auto max-w-sm">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/80
              shadow-[0_8px_40px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)] p-5 text-left space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} viewBox="0 0 24 24" className="w-4 h-4" fill={s <= 4 ? '#22c55e' : '#e5e7eb'}>
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  ))}
                </div>
                <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">Positive</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                "The session was incredibly helpful. I felt heard and understood for the first time…"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-400">Anonymous · just now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest">Process</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">Three simple steps</h2>
            <p className="text-gray-500 max-w-sm mx-auto">Share your experience in under two minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className={`card-hover space-y-4 animate-in`}
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-gray-100 select-none">{n}</span>
                  <div className="w-8 h-8 rounded-xl bg-sage-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-sage-50/30">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest">Why MindSpace</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">Built on trust</h2>
            <p className="text-gray-500 max-w-sm mx-auto">Every design decision prioritises your privacy and comfort.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(({ title, desc, icon, color, iconBg }, i) => (
              <div key={title}
                className={`card-hover bg-gradient-to-br ${color} border-0 space-y-4 animate-in`}
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center`}>
                  {icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-sage-500 to-sage-700
            shadow-sage-lg text-white text-center px-8 py-16 space-y-6">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Takes less than 2 minutes
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Ready to share?</h2>
              <p className="text-sage-100 max-w-sm mx-auto leading-relaxed">
                Your feedback is completely anonymous and helps improve the counseling experience for every student.
              </p>
              <Link href="/feedback"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-sage-700
                  font-semibold text-[15px] hover:bg-sage-50 hover:-translate-y-0.5
                  shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]
                  transition-all duration-200 ease-spring">
                Get Started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">MindSpace</span>
          </div>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} · All feedback is anonymous and confidential</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>Privacy Policy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
