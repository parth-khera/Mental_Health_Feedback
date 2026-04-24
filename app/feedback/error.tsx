'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function FeedbackErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 pt-16 bg-[#f8faf8]">
        <div className="max-w-sm w-full text-center space-y-6 animate-in">
          <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Unable to submit</h2>
            <p className="text-sm text-gray-500 mt-2">
              There was a problem submitting your feedback. Please try again.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => reset()}
              className="btn-primary w-full"
            >
              Try again
            </button>
            <Link href="/" className="btn-ghost w-full">Back to home</Link>
          </div>
        </div>
      </main>
    </>
  )
}
