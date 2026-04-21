import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'MindSpace — Therapist Session Feedback',
  description: 'Share your counseling session experience anonymously. Safe, secure, and non-judgmental.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
