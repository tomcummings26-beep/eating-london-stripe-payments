'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { X, Menu } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useSession } from '@/lib/hooks/useSession'

export default function Navigation() {
  const { session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-black/10">
      <div className="flex h-[64px] items-center justify-between px-6">
        {/* Left cluster: logo + desktop links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-eating-london.svg"
              alt="eating.london"
              width={140}
              height={40}
              priority
            />
          </Link>

          {/* Desktop links (LEFT-ALIGNED) */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="https://eating.london/createalert"
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
              href="https://eating.london/learnmore"
              className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors"
            >
              Learn More
            </Link>

            {session ? (
              <button
                onClick={handleLogout}
                className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Right: mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 hover:text-black transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay (Framer-matched) */}
      <div
        className={`fixed inset-0 z-40 bg-white md:hidden transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top bar */}
        <div className="h-[64px] px-6 flex items-center justify-between border-b border-black/10">
          <Image
            src="/logo-eating-london.svg"
            alt="eating.london"
            width={140}
            height={40}
            priority
          />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="text-gray-700 hover:text-black transition"
          >
            <X size={26} />
          </button>
        </div>

        {/* Menu links */}
        <div className="flex flex-col items-start px-6 pt-[24px] space-y-[28px]">
          <Link
            href="https://eating.london/createalert"
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
            href="https://eating.london/learnmore"
            onClick={() => setMenuOpen(false)}
            className="text-[22px] font-semibold tracking-[-0.02em] leading-[1.2] text-black"
          >
            Learn More
          </Link>

          {/* Logout or Login as last item in the list */}
          {session ? (
            <button
              onClick={handleLogout}
              className="text-[22px] font-semibold tracking-[-0.02em] leading-[1.2] text-black"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-[22px] font-semibold tracking-[-0.02em] leading-[1.2] text-black"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
