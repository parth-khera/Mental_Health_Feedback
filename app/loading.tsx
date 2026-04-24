import Navbar from '@/components/Navbar'

export default function LoadingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center mx-auto animate-pulse">
            <svg className="w-6 h-6 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </main>
    </>
  )
}
