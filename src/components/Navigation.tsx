'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-black/10">
      <div className="flex h-[64px] w-full items-center justify-between px-[32px]">
        {/* Left section */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-eating-london.svg"
              alt="eating.london"
              width={140}
              height={40}
              priority
            />
          </Link>

          <Link
            href="https://eating.london/createalert"
            target="_self" // ensures it opens in same tab
            rel="noopener noreferrer"
            className="text-[15px] font-medium tracking-tight text-[#0099FF] hover:opacity-80 transition-opacity"
          >
            Create Alert
          </Link>
        </div>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-800">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-black transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-black transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hover:text-black transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
