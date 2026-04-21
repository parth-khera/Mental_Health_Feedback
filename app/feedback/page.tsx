'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import RatingStars from '@/components/RatingStars'
import ImageUpload from '@/components/ImageUpload'
import PrivacyBadge from '@/components/PrivacyBadge'
import Link from 'next/link'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function FeedbackPage() {
  const [text,   setText]   = useState('')
  const [rating, setRating] = useState(0)
  const [image,  setImage]  = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')

  const charLimit = 2000
  const canSubmit = text.trim().length > 0 && rating > 0 && status !== 'loading'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('loading')
    setErrMsg('')

    const fd = new FormData()
    fd.append('text', text.trim())
    fd.append('rating', String(rating))
    if (image) fd.append('image', image)

    try {
      const res  = await fetch('/api/feedback', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed.')
      setStatus('success')
    } catch (err: any) {
      setErrMsg(err.message)
      setStatus('error')
    }
  }

  /* ── Success screen ── */
  if (status === 'success') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center px-6 pt-16">
          <div className="max-w-md w-full text-center space-y-8 animate-in">
            {/* Animated checkmark */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-sage-100 animate-ping opacity-30" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-sage-400 to-sage-600
                flex items-center justify-center shadow-sage-lg">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold text-gray-900">Thank you for sharing</h1>
              <p className="text-gray-500 leading-relaxed">
                Your feedback has been received anonymously. It will help improve the counseling
                experience for every student on campus.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Anonymous', icon: '🔒' },
                { label: 'Received',  icon: '✅' },
                { label: 'Secure',    icon: '🛡️' },
              ].map(({ label, icon }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-3 text-center">
                  <div className="text-xl mb-1">{icon}</div>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setText(''); setRating(0); setImage(null); setStatus('idle') }}
                className="btn-primary"
              >
                Submit another
              </button>
              <Link href="/" className="btn-ghost">Back to home</Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  /* ── Form ── */
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-xl mx-auto space-y-8">

          {/* Header */}
          <div className="space-y-3 animate-in">
            <div className="flex items-center gap-2 text-xs font-semibold text-sage-500 uppercase tracking-widest">
              <div className="w-4 h-px bg-sage-300" />
              Session Feedback
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Share your experience</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your feedback is completely anonymous and helps improve student wellbeing.
            </p>
            <PrivacyBadge />
          </div>

          {/* Progress bar */}
          <div className="animate-in animate-in-delay-1">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Progress</span>
              <span>{rating > 0 ? (text.trim() ? '2/2 complete' : '1/2 complete') : '0/2 required'}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sage-400 to-sage-500 rounded-full transition-all duration-500 ease-spring"
                style={{ width: rating > 0 ? (text.trim() ? '100%' : '50%') : '0%' }} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Step 1 — Rating */}
            <div className="card animate-in animate-in-delay-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                  rating > 0 ? 'bg-sage-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>1</div>
                <label className="text-sm font-semibold text-gray-800">
                  Rate your session
                  <span className="text-red-400 ml-1">*</span>
                </label>
              </div>
              <RatingStars value={rating} onChange={setRating} />
            </div>

            {/* Step 2 — Text */}
            <div className="card animate-in animate-in-delay-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                  text.trim() ? 'bg-sage-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>2</div>
                <label className="text-sm font-semibold text-gray-800">
                  Tell us about your experience
                  <span className="text-red-400 ml-1">*</span>
                </label>
              </div>
              <textarea
                className="input-base resize-none h-40 leading-relaxed"
                placeholder="What went well? What could be improved? How did the session make you feel? There are no wrong answers."
                value={text}
                onChange={e => setText(e.target.value)}
                maxLength={charLimit}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Be as specific or as brief as you like</p>
                <p className={`text-xs font-medium transition-colors ${
                  text.length > charLimit * 0.9 ? 'text-amber-500' : 'text-gray-300'
                }`}>
                  {text.length}/{charLimit}
                </p>
              </div>
            </div>

            {/* Step 3 — Image (optional) */}
            <div className="card animate-in animate-in-delay-3 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">3</div>
                  <label className="text-sm font-semibold text-gray-800">Attach an image</label>
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">Optional</span>
              </div>
              <ImageUpload onFile={setImage} />
            </div>

            {/* Privacy notice */}
            <div className="animate-in animate-in-delay-4 flex gap-3 p-4 rounded-2xl
              bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/60">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your submission is <strong className="text-gray-800">completely anonymous</strong>. We never collect your name,
                student ID, or any identifying information. Feedback is only accessible to authorised counseling staff.
              </p>
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="flex gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 animate-in">
                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-700">{errMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary w-full py-4 text-[15px] shadow-sage-lg animate-in animate-in-delay-4"
            >
              {status === 'loading' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting securely…
                </>
              ) : (
                <>
                  Submit Feedback
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
