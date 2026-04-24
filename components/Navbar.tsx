'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const path = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-spring ${
      scrolled
        ? 'bg-white/75 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_24px_rgba(0,0,0,0.06)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-5xl mx-auto px-5 h-[60px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-sage transition-transform duration-200 group-hover:scale-105">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-[15px] tracking-tight">Klinixy</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink href="/feedback" active={path === '/feedback'}>Share Feedback</NavLink>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'text-sage-700 bg-sage-50'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/70'
      }`}
    >
      {children}
      {active && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sage-500" />
      )}
    </Link>
  )
}
