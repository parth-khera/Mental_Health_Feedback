'use client'
import Link from 'next/link'
import Image from 'next/image'
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
        ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_24px_rgba(13,27,42,0.08)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-5xl mx-auto px-5 h-[60px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="MindSpace logo"
            width={32}
            height={32}
            className="rounded-xl transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-semibold text-[15px] tracking-tight" style={{ color: 'var(--slate)' }}>MindSpace</span>
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
        active ? '' : 'hover:bg-[#E0E6EE]/60'
      }`}
      style={{
        color: active ? 'var(--blue)' : 'var(--mid)',
        background: active ? 'rgba(0,229,229,0.10)' : undefined,
      }}
    >
      {children}
      {active && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ background: 'var(--teal)' }} />
      )}
    </Link>
  )
}
