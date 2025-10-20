'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useSession } from '@/lib/hooks/useSession'
import { X, Menu } from 'lucide-react'

export default function Navigation() {
  const router = useRouter()
  const session = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navLinks = (
    <>
      <Link
        href="https://eating.london/createalert"
        onClick={() => setMenuOpen(false)}
        className="text-[18px] font-semibold text-[#0099FF] hover:opacity-80 transition-opacity"
      >
        Create Alert
      </Link>

      {session ? (
        <>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="text-[18px] font-semibold text-black hover:opacity-80 transition-opacity"
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              handleLogout()
              setMenuOpen(false)
            }}
            className="text-[18px] font-semibold text-black hover:opacity-80 transition-opacity"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          href="/login"
          onClick={() => setMenuOpen(false)}
          className="text-[18px] font-semibold text-black hover:opacity-80 transition-opacity"
        >
          Login
        </Link>
      )}

      <Link
        href="#"
        onClick={() => setMenuOpen(false)}
        className="text-[18px] font-semibold text-black hover:opacity-80 transition-opacity"
      >
        Learn More
      </Link>
    </>
  )

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-black/10">
      <div className="flex h-[64px] items-center justify-between px-[24px]">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-eating-london.svg"
            alt="eating.london"
            width={140}
            height={40}
            priority
          />
        </Link>

        <div className="hidden md:flex gap-8 items-center text-[15px] font-medium">
          <Link
            href="https://eating.london/createalert"
            className="text-[15px] font-medium text-[#0099FF] hover:opacity-80 transition-opacity"
          >
            Create Alert
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors"
            >
              Login
            </Link>
          )}

          <Link
            href="#"
            className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors"
          >
            Learn More
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Slide-in Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 text-center transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6"
          aria-label="Close menu"
        >
          <X size={28} />
        </button>
        {navLinks}
      </div>
    </nav>
  )
}
