'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { X, Menu } from 'lucide-react'

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-black/10">
      <div className="flex h-[64px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-eating-london.svg"
            alt="eating.london"
            width={140}
            height={40}
            priority
          />
        </Link>

        {/* Hamburger / Close icon (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 hover:text-black transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={24} />}
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            href="/createalert"
            className="text-[15px] font-medium tracking-tight text-[#0099FF] hover:opacity-80 transition-opacity"
          >
            Create Alert
          </Link>
          <Link
            href="/dashboard"
            className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/learn-more"
            className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Mobile overlay menu — pixel matched to Framer eating.london */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col items-start px-6 pt-[88px] space-y-[28px] md:hidden transition-all">
          <Link
            href="/createalert"
            onClick={() => setMenuOpen(false)}
            className="text-[22px] font-semibold tracking-[-0.02em] leading-[1.2] text-[#0099FF]"
          >
            Create Alert
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="text-[22px] font-semibold tracking-[-0.02em] leading-[1.2] text-black"
          >
            Dashboard
          </Link>
          <Link
            href="/learn-more"
            onClick={() => setMenuOpen(false)}
            className="text-[22px] font-semibold tracking-[-0.02em] leading-[1.2] text-black"
          >
            Learn More
          </Link>
        </div>
      )}
    </nav>
  )
}

