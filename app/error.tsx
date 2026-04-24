'use client'

import Navbar from '@/components/Navbar'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-md w-full text-center space-y-6 animate-in">
          <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
            <p className="text-sm text-gray-500 mt-2">
              An unexpected error occurred. Please try again.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="btn-primary"
          >
            Try again
          </button>
        </div>
      </main>
    </>
  )
}
