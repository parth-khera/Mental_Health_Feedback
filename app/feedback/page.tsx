'use client'
import { useState, useRef } from 'react'
import Navbar from '@/components/Navbar'
import RatingStars from '@/components/RatingStars'
import Link from 'next/link'
import Image from 'next/image'

type Status = 'idle' | 'loading' | 'success' | 'error'

// Personal detail options
const AGE_RANGES = ['Under 18', '18-20', '21-23', '24-26', '27+'];
const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say', 'Other'];
const YEAR_OF_STUDY = ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Graduate', 'Other'];
const VISIT_REASONS = ['Individual Therapy', 'Group Therapy', 'Couples Therapy', 'Family Therapy', 'Crisis Intervention', 'Assessment/Evaluation', 'Other'];

// Tag chips — Google Maps shows contextual tags based on star rating
const TAG_MAP: Record<number, string[]> = {
  0.5: ['Very unsatisfied', 'Waste of time', 'Terrible experience', 'Completely unhelpful'],
  1: ['Felt dismissed', 'Unhelpful', 'Uncomfortable', 'Not listened to', 'Would not return'],
  1.5: ['Very poor', 'Needs major improvement', 'Felt ignored', 'Not worth it'],
  2: ['Below expectations', 'Needs improvement', 'Felt rushed', 'Unclear guidance', 'Somewhat helpful'],
  2.5: ['Below average', 'Disappointing', 'Could be much better', 'Lacking support'],
  3: ['Average session', 'Somewhat helpful', 'Could be better', 'Neutral experience', 'Okay overall'],
  3.5: ['Above average', 'Quite helpful', 'Decent session', 'Helpful at times'],
  4: ['Helpful session', 'Felt heard', 'Good advice', 'Comfortable space', 'Would return'],
  4.5: ['Very good', 'Really helpful', 'Felt supported', 'Great advice', 'Very comfortable'],
  5: ['Excellent session', 'Felt understood', 'Life-changing', 'Highly recommend', 'Very supportive', 'Safe space'],
}

export default function FeedbackPage() {
  const [rating,     setRating]     = useState(0)
  const [text,       setText]       = useState('')
  const [tags,       setTags]       = useState<string[]>([])
  const [images,     setImages]     = useState<File[]>([])
  const [previews,   setPreviews]   = useState<string[]>([])
  const [status,     setStatus]     = useState<Status>('idle')
  const [errMsg,     setErrMsg]     = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  
  // Personal details
  const [ageRange, setAgeRange] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [yearOfStudy, setYearOfStudy] = useState<string>('')
  const [visitReason, setVisitReason] = useState<string>('')

  const charLimit  = 500
  const canSubmit  = rating >= 0.5 && status !== 'loading' && ageRange && gender && yearOfStudy && visitReason
  const availTags  = rating >= 0.5 ? (TAG_MAP[rating] ?? TAG_MAP[Math.floor(rating)] ?? []) : []

  function handleRating(v: number) {
    setRating(v)
    setTags([]) // reset tags when rating changes, just like Google Maps
  }

  function toggleTag(tag: string) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 6 - images.length)
    const valid = files.filter(f => f.size <= 5 * 1024 * 1024)
    setImages(prev => [...prev, ...valid])
    setPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  function removeImage(i: number) {
    setImages(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

    async function handleSubmit() {
    if (!canSubmit) return
    setStatus('loading')
    setErrMsg('')

    const fd = new FormData()
    fd.append('text',   text.trim())
    fd.append('rating', String(rating))
    fd.append('tags',   JSON.stringify(tags))
    fd.append('ageRange', ageRange)
    fd.append('gender', gender)
    fd.append('yearOfStudy', yearOfStudy)
    fd.append('visitReason', visitReason)
    if (images[0]) fd.append('image', images[0])

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

  /* ── Success ── */
  if (status === 'success') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center px-4 pt-16 bg-[#f8faf8]">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-large p-8 text-center space-y-6 animate-in">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-sage-100 animate-ping opacity-40" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-sage">
                <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Review posted!</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Your anonymous feedback has been shared. Thank you for helping improve student wellbeing.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setRating(0); setText(''); setTags([]); setImages([]); setPreviews([]); setStatus('idle') }}
                className="btn-primary w-full"
              >
                Write another review
              </button>
              <Link href="/" className="btn-ghost w-full">Back to home</Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  /* ── Google Maps-style review form ── */
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8faf8] flex items-start justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-lg animate-in">

          {/* Card — mimics the Google Maps review modal */}
          <div className="bg-white rounded-3xl shadow-large overflow-hidden">

            {/* ── Header ── */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {/* Anonymous avatar — Google Maps shows your profile pic here */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">Anonymous Student</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    Your identity is never shared
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">

              {/* ── Giant Stars — exactly like Google Maps ── */}
              <div className="flex flex-col items-center gap-1 py-2">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-2">
                  Rate your session
                </p>
                <RatingStars value={rating} onChange={handleRating} size="lg" />
              </div>

              {/* ── Tag chips — appear after rating, just like Google Maps ── */}
              {availTags.length > 0 && (
                <div className="space-y-2 animate-in">
                  <p className="text-xs text-gray-500 font-medium">What best describes it?</p>
                  <div className="flex flex-wrap gap-2">
                    {availTags.map(tag => {
                      const selected = tags.includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-3.5 py-1.5 rounded-full text-sm font-medium border
                            transition-all duration-150 ease-out
                            hover:scale-[1.03] active:scale-[0.97]
                            ${selected
                              ? 'bg-[#1a73e8] border-[#1a73e8] text-white shadow-sm'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                        >
                          {selected && (
                            <svg className="inline w-3.5 h-3.5 mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                          {tag}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── Text area — Google Maps style: borderless, just a placeholder ── */}
              <div className="space-y-1">
                <textarea
                  className="w-full resize-none text-sm text-gray-800 placeholder:text-gray-400
                    bg-gray-50 rounded-2xl px-4 py-3.5 outline-none border border-transparent
                    focus:border-[#1a73e8] focus:bg-white focus:ring-2 focus:ring-[#1a73e8]/10
                    transition-all duration-200 leading-relaxed"
                  rows={4}
                  placeholder="Share details of your experience at this session (optional)"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  maxLength={charLimit}
                />
                <div className="flex justify-end">
                  <span className={`text-xs ${text.length > charLimit * 0.85 ? 'text-amber-500' : 'text-gray-300'}`}>
                    {text.length}/{charLimit}
                  </span>
                </div>
              </div>

              {/* ── Personal Details ── */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Age Range</p>
                  <select
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                    value={ageRange}
                    onChange={e => setAgeRange(e.target.value)}
                  >
                    <option value="">Select age range</option>
                    {AGE_RANGES.map(range => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Gender</p>
                  <select
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    {GENDER_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Year of Study</p>
                  <select
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                    value={yearOfStudy}
                    onChange={e => setYearOfStudy(e.target.value)}
                  >
                    <option value="">Select year of study</option>
                    {YEAR_OF_STUDY.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Visit Reason</p>
                  <select
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                    value={visitReason}
                    onChange={e => setVisitReason(e.target.value)}
                  >
                    <option value="">Select visit reason</option>
                    {VISIT_REASONS.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ── Photo strip — Google Maps style horizontal scroll ── */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Add photos <span className="text-gray-400 font-normal">(optional)</span></p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {/* Add photo button */}
                  {images.length < 6 && (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200
                        flex flex-col items-center justify-center gap-1
                        hover:border-[#1a73e8] hover:bg-blue-50/50 transition-all duration-200 group"
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1a73e8] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                      <span className="text-[10px] text-gray-400 group-hover:text-[#1a73e8] transition-colors">Photo</span>
                    </button>
                  )}

                  {/* Preview thumbnails */}
                  {previews.map((src, i) => (
                    <div key={i} className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden group">
                      <Image src={src} alt={`Photo ${i+1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full
                          flex items-center justify-center opacity-0 group-hover:opacity-100
                          transition-opacity duration-150"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              </div>

              {/* ── Error ── */}
              {status === 'error' && (
                <div className="flex gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-100 animate-in">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-red-700">{errMsg}</p>
                </div>
              )}
            </div>

            {/* ── Footer actions — Google Maps style: Cancel + Post ── */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
              {/* Privacy note */}
              <p className="text-[11px] text-gray-400 leading-tight max-w-[180px]">
                Posting anonymously · visible only to counseling staff
              </p>

              <div className="flex items-center gap-2 shrink-0">
                <Link href="/"
                  className="px-5 py-2 rounded-full text-sm font-medium text-[#1a73e8]
                    hover:bg-blue-50 transition-colors duration-150">
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`px-6 py-2 rounded-full text-sm font-semibold
                    transition-all duration-200
                    ${canSubmit
                      ? 'bg-[#1a73e8] text-white hover:bg-[#1557b0] shadow-sm hover:shadow-md active:scale-95'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Posting…
                    </span>
                  ) : 'Post'}
                </button>
              </div>
            </div>
          </div>

          {/* Privacy reassurance below card — like Google's "Your review is public" note */}
          <div className="mt-4 flex items-start gap-2 px-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your review is <strong className="text-gray-600">completely anonymous</strong>. No name, student ID, or personal data is ever collected or stored. Only authorised counseling staff can read submissions.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
