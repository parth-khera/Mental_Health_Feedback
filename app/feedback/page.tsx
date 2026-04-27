'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import RatingStars from '@/components/RatingStars'
import Link from 'next/link'

type Status = 'idle' | 'loading' | 'success' | 'error'

const AGE_RANGES     = ['Under 18', '18-20', '21-23', '24-26', '27+']
const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say', 'Other']
const YEAR_OF_STUDY  = ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Graduate', 'Other']
const VISIT_REASONS  = ['Individual Therapy', 'Group Therapy', 'Couples Therapy', 'Family Therapy', 'Crisis Intervention', 'Assessment/Evaluation', 'Other']

const TAG_MAP: Record<number, string[]> = {
  0.5: ['Very unsatisfied', 'Waste of time', 'Terrible experience', 'Completely unhelpful'],
  1:   ['Felt dismissed', 'Unhelpful', 'Uncomfortable', 'Not listened to', 'Would not return'],
  1.5: ['Very poor', 'Needs major improvement', 'Felt ignored', 'Not worth it'],
  2:   ['Below expectations', 'Needs improvement', 'Felt rushed', 'Unclear guidance', 'Somewhat helpful'],
  2.5: ['Below average', 'Disappointing', 'Could be much better', 'Lacking support'],
  3:   ['Average session', 'Somewhat helpful', 'Could be better', 'Neutral experience', 'Okay overall'],
  3.5: ['Above average', 'Quite helpful', 'Decent session', 'Helpful at times'],
  4:   ['Helpful session', 'Felt heard', 'Good advice', 'Comfortable space', 'Would return'],
  4.5: ['Very good', 'Really helpful', 'Felt supported', 'Great advice', 'Very comfortable'],
  5:   ['Excellent session', 'Felt understood', 'Life-changing', 'Highly recommend', 'Very supportive', 'Safe space'],
}

export default function FeedbackPage() {
  const [rating,      setRating]      = useState(0)
  const [text,        setText]        = useState('')
  const [tags,        setTags]        = useState<string[]>([])
  const [status,      setStatus]      = useState<Status>('idle')
  const [errMsg,      setErrMsg]      = useState('')
  const [name,        setName]        = useState('')
  const [email,       setEmail]       = useState('')
  const [collegeId,   setCollegeId]   = useState('')
  const [contact,     setContact]     = useState('')
  const [ageRange,    setAgeRange]    = useState('')
  const [gender,      setGender]      = useState('')
  const [yearOfStudy, setYearOfStudy] = useState('')
  const [visitReason, setVisitReason] = useState('')

  const charLimit = 500
  const canSubmit = rating >= 0.5 && status !== 'loading'
    && name.trim() && email.trim() && collegeId.trim()
    && ageRange && gender && yearOfStudy && visitReason

  const availTags = rating >= 0.5 ? (TAG_MAP[rating] ?? TAG_MAP[Math.floor(rating)] ?? []) : []

  function handleRating(v: number) { setRating(v); setTags([]) }
  function toggleTag(tag: string) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function resetForm() {
    setRating(0); setText(''); setTags([])
    setName(''); setEmail(''); setCollegeId(''); setContact('')
    setAgeRange(''); setGender(''); setYearOfStudy(''); setVisitReason('')
    setStatus('idle'); setErrMsg('')
  }

  async function handleSubmit() {
    if (!canSubmit) return
    setStatus('loading')
    setErrMsg('')

    const fd = new FormData()
    fd.append('name',        name.trim())
    fd.append('email',       email.trim())
    fd.append('collegeId',   collegeId.trim())
    fd.append('contact',     contact.trim())
    fd.append('ageRange',    ageRange)
    fd.append('gender',      gender)
    fd.append('yearOfStudy', yearOfStudy)
    fd.append('visitReason', visitReason)
    fd.append('rating',      String(rating))
    fd.append('text',        text.trim())
    fd.append('tags',        JSON.stringify(tags))

    try {
      const res  = await fetch('/api/feedback', { method: 'POST', body: fd })
      const data = await res.json() as { error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Submission failed.')
      setStatus('success')
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : 'Submission failed.')
      setStatus('error')
    }
  }

  /* ── Success ── */
  if (status === 'success') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center px-4 pt-16" style={{ background: 'var(--bg)' }}>
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center space-y-6 animate-in"
            style={{ boxShadow: '0 8px 32px rgba(13,27,42,0.09)', border: '1px solid var(--silver)' }}>
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ background: 'var(--teal-glow)' }} />
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'var(--teal-grad)', boxShadow: '0 4px 24px var(--teal-glow)' }}>
                <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Review posted!</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Your feedback has been shared. Thank you for helping improve student wellbeing.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={resetForm} className="btn-primary w-full">Write another review</button>
              <Link href="/" className="btn-ghost w-full">Back to home</Link>

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
      <main className="min-h-screen flex items-start justify-center px-4 pt-24 pb-16" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-lg animate-in">
          <div className="bg-white rounded-3xl shadow-large overflow-hidden">

            {/* Header */}
            <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid var(--silver)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--teal-grad)' }}>
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--slate)' }}>Anonymous Student</p>
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--mid)' }}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    Your identity is never shared
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">

              {/* Stars */}
              <div className="flex flex-col items-center gap-1 py-2">
                <p className="text-xs uppercase tracking-widest font-medium mb-2" style={{ color: 'var(--mid)' }}>Rate your session</p>
                <RatingStars value={rating} onChange={handleRating} size="lg" />
              </div>

              {/* Tag chips */}
              {availTags.length > 0 && (
                <div className="space-y-2 animate-in">
                  <p className="text-xs font-medium" style={{ color: 'var(--mid)' }}>What best describes it?</p>
                  <div className="flex flex-wrap gap-2">
                    {availTags.map(tag => {
                      const selected = tags.includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ease-out hover:scale-[1.03] active:scale-[0.97]"
                          style={selected ? {
                            background: 'var(--teal-grad)',
                            borderColor: 'var(--teal-dark)',
                            color: 'white',
                            boxShadow: '0 2px 8px var(--teal-glow)',
                          } : {
                            background: 'white',
                            borderColor: 'var(--silver)',
                            color: 'var(--mid)',
                          }}
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

              {/* Text area */}
              <div className="space-y-1">
                <textarea
                  className="w-full resize-none text-sm rounded-2xl px-4 py-3.5 outline-none border transition-all duration-200 leading-relaxed input-base"
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

              {/* Personal Details */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--mid)' }}>Your Details</p>

                {[
                  { label: 'Full Name',       type: 'text',  placeholder: 'Enter your full name',  value: name,      setter: setName,      required: true },
                  { label: 'Email Address',   type: 'email', placeholder: 'your@email.com',         value: email,     setter: setEmail,     required: true },
                  { label: 'College ID',      type: 'text',  placeholder: 'e.g. STU2024001',        value: collegeId, setter: setCollegeId, required: true },
                  { label: 'Contact Number',  type: 'tel',   placeholder: '+91 XXXXX XXXXX',        value: contact,   setter: setContact,   required: false },
                ].map(({ label, type, placeholder, value, setter, required }) => (
                  <div key={label} className="space-y-2">
                    <p className="text-xs font-medium" style={{ color: 'var(--mid)' }}>
                      {label} {required
                        ? <span style={{ color: '#e53935' }}>*</span>
                        : <span className="font-normal" style={{ color: 'var(--mid)' }}>(optional)</span>
                      }
                    </p>
                    <input
                      type={type}
                      className="input-base"
                      placeholder={placeholder}
                      value={value}
                      onChange={e => setter(e.target.value)}
                    />
                  </div>
                ))}

                {[
                  { label: 'Age Range',    value: ageRange,    setter: setAgeRange,    options: AGE_RANGES,     placeholder: 'Select age range' },
                  { label: 'Gender',       value: gender,      setter: setGender,      options: GENDER_OPTIONS, placeholder: 'Select gender' },
                  { label: 'Year of Study',value: yearOfStudy, setter: setYearOfStudy, options: YEAR_OF_STUDY,  placeholder: 'Select year of study' },
                  { label: 'Visit Reason', value: visitReason, setter: setVisitReason, options: VISIT_REASONS,  placeholder: 'Select visit reason' },
                ].map(({ label, value, setter, options, placeholder }) => (
                  <div key={label} className="space-y-2">
                    <p className="text-xs font-medium" style={{ color: 'var(--mid)' }}>{label} <span style={{ color: '#e53935' }}>*</span></p>
                    <select
                      className="input-base"
                      value={value}
                      onChange={e => setter(e.target.value)}
                    >
                      <option value="">{placeholder}</option>
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Error */}
              {status === 'error' && (
                <div className="flex gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-100 animate-in">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-red-700">{errMsg}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex items-center justify-between gap-3"
              style={{ borderTop: '1px solid var(--silver)' }}>
              <p className="text-[11px] leading-tight max-w-[180px]" style={{ color: 'var(--mid)' }}>
                Your details are kept confidential · visible only to counseling staff
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/" className="px-5 py-2 rounded-full text-sm font-medium transition-colors duration-150 hover:bg-[rgba(0,229,229,0.08)]"
                  style={{ color: 'var(--blue)' }}>
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95"
                  style={canSubmit ? {
                    background: 'var(--teal-grad)',
                    color: 'white',
                    boxShadow: '0 2px 8px var(--teal-glow)',
                  } : {
                    background: 'var(--silver)',
                    color: 'var(--mid)',
                    cursor: 'not-allowed',
                  }}
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

          <div className="mt-4 flex items-start gap-2 px-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your details are kept <strong className="text-gray-600">strictly confidential</strong>. Only authorised counseling staff can access your submission.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
